from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Ride, Student
from .serializers import StudentSerializer
from rest_framework import viewsets
from rest_framework.decorators import action

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

    @action(methods=['get'], detail=True,
            url_path='cr-student', url_name='create_student')
    def cr_student_func(self, request, pk=None):
        print("ADSFDSFAADSFDSADSFDSAF")
        student = Student.create(23456, "testing", "mandy", "li", "jk@gmail.com", 1233123213)
        template = loader.get_template('cr_student.html')
        context = {
            'student': student,
        }
        student.save()
        return render(request, 'cr_student.html', context)

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
