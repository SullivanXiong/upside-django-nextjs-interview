from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
    # API root
    path("", views.index, name="index"),
    
    # Original endpoints
    path("api/events/random/", views.random_activity_events, name="random-activity-events"),
    path("api/people/random/", views.random_persons, name="random-people"),
    
    # Dashboard endpoints
    path("api/dashboard/stats/", views.dashboard_stats, name="dashboard-stats"),
    path("api/dashboard/activity-timeline/", views.activity_timeline, name="activity-timeline"),
    path("api/dashboard/channel-breakdown/", views.channel_breakdown, name="channel-breakdown"),
] 