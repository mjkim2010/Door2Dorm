from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Ride, Student

def ride_queue_view(request):
    latest_rides_list = Ride.objects.order_by('time_requested')
    template = loader.get_template('ride_queue.html')
    context = { 
        'latest_rides_list': latest_rides_list,
    }
    return render(request, 'ride_queue.html', context)

def create_student(request):
    student = Student.create(1213123, "testing", "mandy", "li", "jk@gmail.com", 1233123213)
    template = loader.get_template('cr_student.html')
    context = { 
        'student': student,
    }
    student.save()
    return render(request, 'cr_student.html', context)
