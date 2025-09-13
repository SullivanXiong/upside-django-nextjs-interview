from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import QuerySet, Count, Q
from django.utils import timezone
from datetime import timedelta
import json
from typing import Dict, List, Set

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
    raw_events: List[dict] = list(events_qs.values())

    # Enrich people with names from Person table
    person_ids: Set[str] = set()
    for ev in raw_events:
        for p in ev.get("people", []) or []:
            pid = p.get("id")
            if pid:
                person_ids.add(pid)

    people_lookup: Dict[str, dict] = {}
    if person_ids:
        for person in Person.objects.filter(id__in=person_ids).values("id", "first_name", "last_name"):
            people_lookup[person["id"]] = {
                "id": person["id"],
                "first_name": person.get("first_name") or "",
                "last_name": person.get("last_name") or "",
            }

    for ev in raw_events:
        enriched_people: List[dict] = []
        for p in ev.get("people", []) or []:
            pid = p.get("id")
            base = {"id": pid}
            if pid in people_lookup:
                base.update(people_lookup[pid])
            else:
                base.update({"first_name": "", "last_name": ""})
            # preserve role if present
            if p.get("role_in_touchpoint"):
                base["role_in_touchpoint"] = p.get("role_in_touchpoint")
            enriched_people.append(base)
        ev["people"] = enriched_people

    return JsonResponse(raw_events, safe=False)

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
