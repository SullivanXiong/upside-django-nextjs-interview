from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import QuerySet, Count, Q, Min, Max
from django.db import models
from django.utils import timezone
from django.core.paginator import Paginator
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


def all_activity_events(request):
    """Return all ActivityEvent records with pagination for the given customer.
    
    Query parameters:
    - customer_org_id (required)
    - account_id (optional)
    - page (optional, default: 1)
    - page_size (optional, default: 10)
    - sort_by (optional, default: '-timestamp')
    """
    customer_org_id = request.GET.get("customer_org_id")
    
    if not customer_org_id:
        return JsonResponse(
            {"error": "'customer_org_id' query parameter is required."},
            status=400,
        )
    
    # Build query
    events_qs = ActivityEvent.objects.filter(customer_org_id=customer_org_id)
    
    # Optional account_id filter
    account_id = request.GET.get("account_id")
    if account_id:
        events_qs = events_qs.filter(account_id=account_id)
    
    # Sorting (default: newest first)
    sort_by = request.GET.get("sort_by", "-timestamp")
    events_qs = events_qs.order_by(sort_by)
    
    # Get total count before pagination
    total_count = events_qs.count()
    
    # Get date range of all events
    date_range = events_qs.aggregate(
        min_date=models.Min('timestamp'),
        max_date=models.Max('timestamp')
    )
    
    # Pagination
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))
    
    paginator = Paginator(events_qs, page_size)
    page_obj = paginator.get_page(page)
    
    # Get events for current page
    events = list(page_obj.object_list.values())
    
    # Get date range for current page
    if events:
        page_date_range = {
            "start": events[-1]["timestamp"].isoformat() if events else None,
            "end": events[0]["timestamp"].isoformat() if events else None,
        }
    else:
        page_date_range = {"start": None, "end": None}
    
    return JsonResponse({
        "results": events,
        "pagination": {
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": paginator.num_pages,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
        },
        "date_range": {
            "overall": {
                "start": date_range["min_date"].isoformat() if date_range["min_date"] else None,
                "end": date_range["max_date"].isoformat() if date_range["max_date"] else None,
            },
            "current_page": page_date_range
        }
    })


def all_events_for_chart(request):
    """Return all ActivityEvent records aggregated for chart visualization.
    
    Query parameters:
    - customer_org_id (required)
    - account_id (optional)
    """
    customer_org_id = request.GET.get("customer_org_id")
    
    if not customer_org_id:
        return JsonResponse(
            {"error": "'customer_org_id' query parameter is required."},
            status=400,
        )
    
    # Build query
    events_qs = ActivityEvent.objects.filter(customer_org_id=customer_org_id)
    
    # Optional account_id filter
    account_id = request.GET.get("account_id")
    if account_id:
        events_qs = events_qs.filter(account_id=account_id)
    
    # Get all events ordered by timestamp
    events_qs = events_qs.order_by('timestamp')
    
    # Get all events with minimal fields for chart
    events = list(events_qs.values('id', 'timestamp', 'activity', 'channel', 'status'))
    
    # Get date range
    if events:
        date_range = {
            "start": events[0]["timestamp"].isoformat(),
            "end": events[-1]["timestamp"].isoformat(),
        }
    else:
        date_range = {"start": None, "end": None}
    
    # Group by date for daily counts
    daily_counts = {}
    for event in events:
        date_key = event['timestamp'].date().isoformat()
        if date_key not in daily_counts:
            daily_counts[date_key] = 0
        daily_counts[date_key] += 1
    
    # Convert to sorted list
    daily_data = [
        {"date": date, "count": count}
        for date, count in sorted(daily_counts.items())
    ]
    
    return JsonResponse({
        "events": events,
        "daily_counts": daily_data,
        "total_count": len(events),
        "date_range": date_range
    })


def all_persons(request):
    """Return all Person records for the given customer.
    
    Query parameters:
    - customer_org_id (required)
    """
    customer_org_id = request.GET.get("customer_org_id")
    
    if not customer_org_id:
        return JsonResponse(
            {"error": "'customer_org_id' query parameter is required."},
            status=400,
        )
    
    persons_qs = Person.objects.filter(customer_org_id=customer_org_id)
    persons = list(persons_qs.values())
    
    return JsonResponse({
        "results": persons,
        "count": len(persons)
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
