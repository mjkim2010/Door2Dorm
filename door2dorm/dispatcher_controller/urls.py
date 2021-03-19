from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('drivers', views.DriverViewSet)
router.register('students', views.StudentViewSet)
router.register('rides', views.RideViewSet)

urlpatterns = [
    path('', views.dispatcher, name='dispatcher'),
    # This adds the HTTP request endpoints defined in views.py
    re_path('^', include(router.urls)),
]
