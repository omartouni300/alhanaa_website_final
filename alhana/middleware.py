from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import now
from .models import SiteVisit

class VisitorTrackingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # تجاهل ملفات static و AJAX
        if request.path.startswith('/static/') or request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return

        session_key = request.session.session_key
        if not session_key:
            request.session.save()
            session_key = request.session.session_key

        ip = get_client_ip(request)
        path = request.path

        # ✅ لو فيه زيارة مفتوحة سابقة لصفحة تانية، اقفلها
        last_visit = SiteVisit.objects.filter(
            session_key=session_key,
            exit_time__isnull=True
        ).order_by('-enter_time').first()

        if last_visit and last_visit.path != path:
            last_visit.exit_time = now()
            last_visit.save()

        # ✅ لو مفيش زيارة مفتوحة لنفس الصفحة، سجّل واحدة جديدة
        if not SiteVisit.objects.filter(session_key=session_key, path=path, exit_time__isnull=True).exists():
            visit = SiteVisit.objects.create(
                ip_address=ip,
                path=path,
                session_key=session_key,
            )
            request.session['last_visit_id'] = visit.id

    def process_response(self, request, response):
        # بنقفل الزيارة المفتوحة لما الصفحة تخلص تحميل
        visit_id = request.session.get('last_visit_id')
        if visit_id:
            try:
                visit = SiteVisit.objects.get(id=visit_id, exit_time__isnull=True)
                visit.exit_time = now()
                visit.save()
            except SiteVisit.DoesNotExist:
                pass
        return response

def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip
