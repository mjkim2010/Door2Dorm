from django.urls import path

from . import views

urlpatterns = [
    path('', views.ride_queue_view, name='ride_queue_view'),
]
