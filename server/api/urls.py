from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
    # API root
    path("", views.index, name="index"),
    
    # Original endpoints (kept for compatibility)
    path("api/events/random/", views.random_activity_events, name="random-activity-events"),
    path("api/people/random/", views.random_persons, name="random-people"),
    
    # New paginated endpoints
    path("api/events/", views.all_activity_events, name="all-activity-events"),
    path("api/events/chart/", views.all_events_for_chart, name="all-events-chart"),
    path("api/people/", views.all_persons, name="all-people"),
    
    # Dashboard endpoints
    path("api/dashboard/stats/", views.dashboard_stats, name="dashboard-stats"),
    path("api/dashboard/activity-timeline/", views.activity_timeline, name="activity-timeline"),
    path("api/dashboard/channel-breakdown/", views.channel_breakdown, name="channel-breakdown"),
] 
