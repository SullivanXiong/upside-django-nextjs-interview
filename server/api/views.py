from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import QuerySet, Count, Q
from django.utils import timezone
from datetime import timedelta
import json

# Create your views here.

def index(request):
    return JsonResponse({
        "message": "Dashboard API",
        "version": "1.0.0",
        "endpoints": {
            "events": "/api/events/",
            "people": "/api/people/",
            "dashboard_stats": "/api/dashboard/stats/",
            "activity_timeline": "/api/dashboard/activity-timeline/",
            "channel_breakdown": "/api/dashboard/channel-breakdown/"
        }
    })

from .models import ActivityEvent, Person


# -----------------------------------------------------------------------------
# API Endpoints
# -----------------------------------------------------------------------------

def random_activity_events(request):
    """Return up to 10 random ActivityEvent records for the given customer.

    Query parameters:
    - customer_org_id (required)
    - account_id (required)
    """
    customer_org_id = request.GET.get("customer_org_id")
    account_id = request.GET.get("account_id")

    if not customer_org_id or not account_id:
        return JsonResponse(
            {
                "error": "Both 'customer_org_id' and 'account_id' query parameters are required."
            },
            status=400,
        )

    events_qs: QuerySet = (
        ActivityEvent.objects.filter(
            customer_org_id=customer_org_id, account_id=account_id
        )
        .order_by("?")[:10]
    )

    # Use .values() to get dictionaries of all model fields.
    events = list(events_qs.values())
    return JsonResponse(events, safe=False)

def random_persons(request):
    """Return up to 5 random Person records for the given customer.

    Query parameters:
    - customer_org_id (required)
    """

    customer_org_id = request.GET.get("customer_org_id")

    if not customer_org_id:
        return JsonResponse(
            {"error": "'customer_org_id' query parameter is required."},
            status=400,
        )

    persons_qs: QuerySet = (
        Person.objects.filter(customer_org_id=customer_org_id).order_by("?")[:5]
    )

    persons = list(persons_qs.values())
    return JsonResponse(persons, safe=False)


# -----------------------------------------------------------------------------
# Dashboard API Endpoints
# -----------------------------------------------------------------------------

def dashboard_stats(request):
    """Return dashboard statistics for the given customer."""
    customer_org_id = request.GET.get("customer_org_id")
    
    if not customer_org_id:
        return JsonResponse(
            {"error": "'customer_org_id' query parameter is required."},
            status=400,
        )
    
    # Get date range (default to last 30 days)
    days = int(request.GET.get("days", 30))
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)
    
    # Get events for the customer
    events_qs = ActivityEvent.objects.filter(
        customer_org_id=customer_org_id,
        timestamp__gte=start_date,
        timestamp__lte=end_date
    )
    
    # Get people for the customer
    people_qs = Person.objects.filter(customer_org_id=customer_org_id)
    
    # Calculate statistics
    total_events = events_qs.count()
    total_people = people_qs.count()
    
    # Events by status
    status_breakdown = list(events_qs.values('status').annotate(count=Count('status')))
    
    # Events by channel
    channel_breakdown = list(events_qs.values('channel').annotate(count=Count('channel')))
    
    # Recent activity (last 7 days)
    recent_events = events_qs.filter(
        timestamp__gte=timezone.now() - timedelta(days=7)
    ).count()
    
    stats = {
        "total_events": total_events,
        "total_people": total_people,
        "recent_events": recent_events,
        "status_breakdown": status_breakdown,
        "channel_breakdown": channel_breakdown,
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),
            "days": days
        }
    }
    
    return JsonResponse(stats)


def activity_timeline(request):
    """Return activity events over time for chart visualization."""
    customer_org_id = request.GET.get("customer_org_id")
    
    if not customer_org_id:
        return JsonResponse(
            {"error": "'customer_org_id' query parameter is required."},
            status=400,
        )
    
    # Get date range (default to last 30 days)
    days = int(request.GET.get("days", 30))
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)
    
    # Get events grouped by day
    events_qs = ActivityEvent.objects.filter(
        customer_org_id=customer_org_id,
        timestamp__gte=start_date,
        timestamp__lte=end_date
    ).extra(
        select={'day': 'date(timestamp)'}
    ).values('day').annotate(count=Count('id')).order_by('day')
    
    timeline_data = list(events_qs)
    
    return JsonResponse({
        "timeline": timeline_data,
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),
            "days": days
        }
    })


def channel_breakdown(request):
    """Return detailed breakdown of events by channel."""
    customer_org_id = request.GET.get("customer_org_id")
    
    if not customer_org_id:
        return JsonResponse(
            {"error": "'customer_org_id' query parameter is required."},
            status=400,
        )
    
    # Get date range (default to last 30 days)
    days = int(request.GET.get("days", 30))
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)
    
    # Get events grouped by channel and status
    events_qs = ActivityEvent.objects.filter(
        customer_org_id=customer_org_id,
        timestamp__gte=start_date,
        timestamp__lte=end_date
    ).values('channel', 'status').annotate(count=Count('id')).order_by('channel', 'status')
    
    breakdown_data = list(events_qs)
    
    return JsonResponse({
        "breakdown": breakdown_data,
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),
            "days": days
        }
    })


def touchpoints(request):
    """Return touchpoint events for the table display."""
    customer_org_id = request.GET.get("customer_org_id")
    
    if not customer_org_id:
        # If no customer_org_id is provided, use a default one for demo
        # Get the first available customer_org_id from the database
        first_event = ActivityEvent.objects.first()
        if first_event:
            customer_org_id = first_event.customer_org_id
        else:
            return JsonResponse({"touchpoints": [], "total": 0})
    
    # Pagination parameters
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))
    offset = (page - 1) * page_size
    
    # Get events for the customer
    events_qs = ActivityEvent.objects.filter(
        customer_org_id=customer_org_id
    ).order_by('-timestamp')
    
    total_count = events_qs.count()
    
    # Get paginated events
    events = events_qs[offset:offset + page_size]
    
    # Format the data for frontend
    touchpoints_data = []
    for event in events:
        # Get person details from the people JSON field
        people_list = event.people if isinstance(event.people, list) else []
        primary_person = None
        additional_people = 0
        
        if people_list:
            # Try to get the actual person from the Person model
            if people_list[0]:
                try:
                    person = Person.objects.get(id=people_list[0], customer_org_id=customer_org_id)
                    primary_person = f"{person.first_name} {person.last_name}"
                except Person.DoesNotExist:
                    primary_person = "Unknown Person"
            additional_people = len(people_list) - 1 if len(people_list) > 1 else 0
        
        # Map channel to color
        channel_colors = {
            'Meeting': 'purple',
            'Email': 'blue',
            'Chatbot': 'yellow',
            'Default': 'gray'
        }
        channel_color = channel_colors.get(event.channel, 'gray')
        
        # Map status to icon
        status_icons = {
            'Conversation': 'conversation',
            'Booked': 'booked',
            'Chatted': 'chatted',
            'Replied': 'replied',
            'Sent': 'sent'
        }
        status_icon = status_icons.get(event.status, 'sent')
        
        # Get team labels from involved_team_ids
        team_labels = []
        team_colors = []
        if event.involved_team_ids:
            for team_id in event.involved_team_ids[:2]:  # Limit to 2 teams for display
                if 'marketing' in str(team_id).lower():
                    team_labels.append('MARKETING')
                    team_colors.append('red')
                elif 'sales' in str(team_id).lower():
                    team_labels.append('SALES')
                    team_colors.append('blue')
                elif 'sdr' in str(team_id).lower():
                    team_labels.append('SDR')
                    team_colors.append('green')
                else:
                    team_labels.append('UNKNOWN')
                    team_colors.append('gray')
        
        if not team_labels:
            team_labels = ['UNKNOWN']
            team_colors = ['gray']
        
        touchpoint = {
            'id': event.touchpoint_id,
            'type': 'outgoing' if event.direction == 'OUT' else 'incoming',
            'date': event.timestamp.strftime('%b %d, %Y'),
            'activity': event.activity[:50] if event.activity else 'No activity description',
            'people': primary_person or 'Unknown',
            'additionalPeople': additional_people,
            'channel': {
                'name': event.channel,
                'color': channel_color
            },
            'status': {
                'text': event.status,
                'icon': status_icon
            },
            'team': {
                'labels': team_labels,
                'colors': team_colors
            }
        }
        touchpoints_data.append(touchpoint)
    
    return JsonResponse({
        'touchpoints': touchpoints_data,
        'total': total_count,
        'page': page,
        'page_size': page_size,
        'total_pages': (total_count + page_size - 1) // page_size
    })


def chart_data(request):
    """Return data formatted for the chart visualization."""
    customer_org_id = request.GET.get("customer_org_id")
    
    if not customer_org_id:
        # Get the first available customer_org_id for demo
        first_event = ActivityEvent.objects.first()
        if first_event:
            customer_org_id = first_event.customer_org_id
        else:
            return JsonResponse({"chart_data": {}})
    
    # Get data for the last 12 months
    end_date = timezone.now()
    start_date = end_date - timedelta(days=365)
    
    # Get events grouped by month
    from django.db.models.functions import TruncMonth
    events_qs = ActivityEvent.objects.filter(
        customer_org_id=customer_org_id,
        timestamp__gte=start_date,
        timestamp__lte=end_date
    ).annotate(
        month=TruncMonth('timestamp')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')
    
    # Format data for chart
    labels = []
    data = []
    markers = []
    
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for item in events_qs:
        if item['month']:
            month_str = f"{month_names[item['month'].month - 1]} {item['month'].year}"
            labels.append(month_str)
            data.append(item['count'])
            
            # Create markers (simplified - just showing count)
            marker_label = f"+{item['count'] // 10}" if item['count'] >= 10 else str(item['count'])
            markers.append({
                'month': month_str,
                'label': marker_label,
                'position': item['count']
            })
    
    # If we don't have enough data, pad with zeros
    if len(labels) < 12:
        # Generate last 12 months
        all_months = []
        current = end_date
        for i in range(12):
            month_str = f"{month_names[current.month - 1]} {current.year}"
            if month_str not in labels:
                all_months.append((month_str, 0))
            else:
                idx = labels.index(month_str)
                all_months.append((month_str, data[idx]))
            current = current - timedelta(days=30)
        
        all_months.reverse()
        labels = [m[0] for m in all_months]
        data = [m[1] for m in all_months]
        
        # Recreate markers
        markers = []
        for i, (label, value) in enumerate(all_months):
            if value > 0:
                marker_label = f"+{value // 10}" if value >= 10 else str(value)
            else:
                marker_label = "0"
            markers.append({
                'month': label,
                'label': marker_label,
                'position': value
            })
    
    chart_data = {
        'labels': labels,
        'datasets': [{
            'label': 'Navigation Data',
            'data': data,
            'borderColor': '#3b82f6',
            'backgroundColor': 'rgba(59, 130, 246, 0.1)',
            'pointBackgroundColor': '#3b82f6',
            'pointBorderColor': '#3b82f6',
            'pointRadius': 4,
            'pointHoverRadius': 6,
            'tension': 0.4,
            'fill': True
        }],
        'markers': markers
    }
    
    return JsonResponse({'chart_data': chart_data})
