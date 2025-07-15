from django.db import models



class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"

from django.db import models

from django.db import models

class SiteVisit(models.Model):
    ip_address = models.GenericIPAddressField()
    session_key = models.CharField(max_length=40, null=True, blank=True)
    path = models.CharField(max_length=255)
    enter_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)

    def duration(self):
        if self.exit_time:
            return self.exit_time - self.enter_time
        return None

    def __str__(self):
        return f"{self.ip_address} - {self.path} ({self.enter_time.strftime('%H:%M:%S')})"