from django.db.models import Count
from django.utils.timezone import now
from .models import SiteVisit
from datetime import timedelta

def get_dashboard_data():
    today = now().date()

    visits_today = SiteVisit.objects.filter(enter_time__date=today)

    total_visits_today = visits_today.count()

    most_visited_pages = (
        visits_today
        .values('path')
        .annotate(visits=Count('id'))
        .order_by('-visits')[:5]
    )

    top_ips = (
        visits_today
        .values('ip_address')
        .annotate(visits=Count('id'))
        .order_by('-visits')[:5]
    )

    # ✅ نحسب المدة يدويًا بدل Avg()
    total_duration = timedelta()
    count = 0
    for v in visits_today:
        if v.exit_time and v.enter_time:
            total_duration += (v.exit_time - v.enter_time)
            count += 1

    average_duration = total_duration / count if count > 0 else None

    return {
        'total_visits_today': total_visits_today,
        'most_visited_pages': most_visited_pages,
        'top_ips': top_ips,
        'average_duration': average_duration,
    }
