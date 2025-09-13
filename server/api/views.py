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


# -----------------------------------------------------------------------------
# Enriched Events Endpoint for Frontend Table
# -----------------------------------------------------------------------------

def latest_activity_events(request):
    """Return latest ActivityEvent records, enriched for the frontend table.

    Query parameters:
    - customer_org_id (required)
    - account_id (required)
    - limit (optional, default=5)
    """

    customer_org_id = request.GET.get("customer_org_id")
    account_id = request.GET.get("account_id")
    try:
        limit = int(request.GET.get("limit", 5))
    except ValueError:
        limit = 5

    if not customer_org_id or not account_id:
        return JsonResponse(
            {
                "error": "Both 'customer_org_id' and 'account_id' query parameters are required."
            },
            status=400,
        )

    # Map channels to color tokens used by the UI
    channel_color_map = {
        "Meeting": "purple",
        "Event": "purple",
        "Event With Webinar": "purple",
        "Default": "gray",
        "Email": "gray",
        "Bulk Marketing Email": "gray",
        "Chatbot": "yellow",
        "Direct Email": "blue",
    }

    # Map team ids to human labels and UI color chips
    team_label_color_map = {
        "team_marketing": ("MARKETING", "red"),
        "team_sales": ("SALES", "blue"),
        "team_sdr": ("SDR", "green"),
    }

    # Map statuses to icons used by the UI
    def map_status_to_icon(channel: str, status: str) -> str:
        normalized = (status or "").strip().upper()
        if channel == "Direct Email":
            if normalized == "REPLIED":
                return "replied"
            return "sent"
        if channel == "Chatbot":
            return "chatted"
        if "BOOK" in normalized:
            return "booked"
        return "conversation"

    events_qs: QuerySet = (
        ActivityEvent.objects.filter(
            customer_org_id=customer_org_id,
            account_id=account_id,
        )
        .order_by("-timestamp")[: max(1, min(limit, 50))]
    )

    results: list[dict] = []

    # Build enriched rows for the table
    for index, ev in enumerate(events_qs, start=1):
        # People enrichment: take the first person as the primary display name
        primary_person_name = "Unknown Person"
        additional_people_count = 0
        try:
            people_list = ev.people or []
            additional_people_count = max(0, len(people_list) - 1)
            if people_list:
                first_person_id = people_list[0].get("id")
                if first_person_id:
                    p = Person.objects.filter(id=first_person_id).first()
                    if p:
                        primary_person_name = f"{p.first_name} {p.last_name}"
        except Exception:  # pragma: no cover - defensive against unexpected data
            pass

        # Channel UI mapping
        channel_name = ev.channel or "Default"
        channel_color = channel_color_map.get(channel_name, "gray")

        # Status UI mapping
        status_text = ev.status or ""
        status_icon = map_status_to_icon(channel_name, status_text)

        # Team labels/colors
        team_labels: list[str] = []
        team_colors: list[str] = []
        try:
            for team_id in (ev.involved_team_ids or []):
                label, color = team_label_color_map.get(team_id, ("UNKNOWN", "gray"))
                team_labels.append(label)
                team_colors.append(color)
            if not team_labels:
                team_labels.append("UNKNOWN")
                team_colors.append("gray")
        except Exception:  # pragma: no cover
            team_labels = ["UNKNOWN"]
            team_colors = ["gray"]

        # Type mapping from direction
        if (ev.direction or "").upper() == "IN":
            event_type = "incoming"
        else:
            event_type = "outgoing"

        # Date formatting (e.g., "Dec 1, 2023")
        try:
            date_str = ev.timestamp.strftime("%b %-d, %Y")  # Linux-compatible
        except Exception:
            # Fallback for platforms where %-d is unsupported
            date_str = ev.timestamp.strftime("%b %d, %Y").replace(" 0", " ")

        results.append(
            {
                "id": index,
                "type": event_type,
                "date": date_str,
                "activity": ev.activity or "",
                "people": primary_person_name,
                "additionalPeople": additional_people_count,
                "channel": {"name": channel_name, "color": channel_color},
                "status": {"text": status_text or "", "icon": status_icon},
                "team": {"labels": team_labels, "colors": team_colors},
            }
        )

    return JsonResponse(results, safe=False)
