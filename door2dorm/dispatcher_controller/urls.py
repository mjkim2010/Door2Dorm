from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('students', views.StudentViewSet)
router.register('rides', views.RideViewSet)

urlpatterns = [
    path('', views.ride_queue_view, name='ride_queue_view'),
    path('cr-student/', views.create_student, name='create_student'),
    re_path('^', include(router.urls)),
]
