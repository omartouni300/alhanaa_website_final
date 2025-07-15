from django.urls import path
from . import views
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('about/', views.about_view, name='about'),
    path('contact/', views.contact_view, name='contact'),
    path('products/', views.products_view, name='products'),
    path('certificates/', views.certificates_view, name='certificates'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard')

]

