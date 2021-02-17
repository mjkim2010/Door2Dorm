from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Ride

def ride_queue_view(request):
    latest_rides_list = Ride.objects.order_by('time_requested')
    template = loader.get_template('ride_queue.html')
    context = { 
        'latest_rides_list': latest_rides_list,
    }
    return render(request, 'ride_queue.html', context)
