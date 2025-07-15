from django.contrib import admin
from django.urls import reverse, path
from django.utils.html import format_html
from django.template.response import TemplateResponse

from .models import ContactMessage, SiteVisit
from . import views

# ✅ الموديل: SiteVisit
@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'path', 'enter_time', 'exit_time', 'get_duration', 'session_key')
    list_filter = ('ip_address', 'path', 'enter_time')
    search_fields = ('ip_address', 'path', 'session_key')
    ordering = ('-enter_time',)

    def get_duration(self, obj):
        if obj.duration():
            seconds = int(obj.duration().total_seconds())
            minutes = seconds // 60
            seconds = seconds % 60
            return f"{minutes}m {seconds}s"
        return "-"
    get_duration.short_description = "Duration"

# ✅ الموديل: ContactMessage
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    pass

# ✅ لوحة تحكم مخصصة
class CustomAdminSite(admin.AdminSite):
    site_header = 'AL HANAA Admin'
    site_title = 'AL HANAA Admin Portal'
    index_title = 'Welcome to AL HANAA Dashboard'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(views.admin_dashboard), name='admin-dashboard'),
        ]
        return custom_urls + urls

# ✅ تسجيل الـ CustomAdmin
admin_site = CustomAdminSite(name='custom_admin')

# ✅ نسجّل الموديلات تاني مع النسخة الجديدة
admin_site.register(SiteVisit, SiteVisitAdmin)
admin_site.register(ContactMessage, ContactMessageAdmin)
