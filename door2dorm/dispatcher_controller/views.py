from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.template import loader
import json

from .models import Ride, Student, Driver
from .serializers import StudentSerializer, RideSerializer, DriverSerializer
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
import random
from django.utils.dateparse import parse_datetime
from django.db import models, transaction
from datetime import datetime

def get_value(name, val_type, request):
    if not request:
        return None
    
    # By default, 'axios.post' sends data in json format while djangos's request.POST
    # assumes data is as a form. We therefore have to read the body into a dictionary
    # using the json package. 
    received_json_data = json.loads(request.body.decode("utf-8"))
    val = received_json_data[name]
    
    if val_type == 'str':
        return str(val)
    if val_type == 'int':
        return int(val)
    if val_type == 'float':
        return float(val)
    

class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

    @action(methods=['post'], detail=True,
            url_path='cr-student', url_name='create_student')
    def cr_student_func(self, request, pk=None):
        try:
            sunet = get_value("sunet", 'str', request)
            first = get_value("first", 'str', request)
            last = get_value("last", 'str', request)
            phone = get_value("phone", 'int', request)
            password = get_value("password", 'str', request)
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))


        student = Student.create(
            sunet,
            first,
            last,
            sunet + "@stanford.edu",
            phone,
            password
        )
        student.save()
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=201)

class RideViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RideSerializer
    queryset = Ride.objects.all()

    @action(methods=['post'], detail=True,
            url_path='cr-ride', url_name='create_ride')
    def cr_ride_func(self, request, pk=None):
        try:
            sunet = get_value("sunet", "str", request)
            current_loc = get_value("origin", 'str', request)
            dest = get_value("dest", 'str', request)
            num_riders = get_value("num_riders", 'int', request)
            safety_level = get_value("safety_level", 'int', request)
            cur_lat = get_value("origin_lat", 'float', request)
            cur_long = get_value("origin_long", 'float', request)
            dest_lat = get_value("dest_lat", 'float', request)
            dest_long = get_value("dest_long", 'float', request)
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))

        student = Student.objects.filter(sunet=sunet).first() #TODO: add a check to make sure the student exists in the database
        if student is None:
            return HttpResponseBadRequest("The sunet \"{}\" does not match a rider in our database".format(sunet))

        ride = Ride.create(
            student, 
            num_riders, 
            safety_level, 
            current_loc, 
            cur_lat, 
            cur_long, 
            dest,
            dest_lat,
            dest_long
        )
        ride.save()
        serializer = RideSerializer(ride)
        return Response(serializer.data, status=201)

class DriverViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = DriverSerializer 
    queryset = Driver.objects.all()

    @action(methods=['post'], detail=True,
            url_path='cr-driver', url_name='create_driver')
    def cr_driver_func(self, request, pk=None):
        try:
            first = get_value("first", 'str', request)
            last = get_value("last", 'str', request)
            email = get_value("email", 'str', request)
            phone = get_value("phone", 'int', request)
            dl = get_value("license", 'str', request)
            pwd = get_value("password", 'str', request)
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))

        driver = Driver.create(dl,
            first,
            last,
            email,
            phone,
            pwd)

        driver.save()
        serializer = DriverSerializer(driver)
        return Response(serializer.data, status=201)

    """
    Grabs the oldest request for a ride that hasn't been assigned. Atomic so that multiple
    drivers don't grab the same ride.
    """
    @transaction.atomic
    def get_available_ride(self, driver):
        r = Ride.objects.filter(assigned=False).order_by('-time_requested').first()
        if r is not None:
             r.assigned = True
             r.driver = driver
        return r

    """
    Driver notifies the server that they are ready to pick up a ride.
    The server responds with a route if there are rides in the queue,
    otherwise telling the Driver to wait.
    """
    @action(methods=['post'], detail=True,
            url_path='driver-ready', url_name='driver_ready')
    def driver_ready(self, request, pk=None):
        try:
            email = get_value("email", 'str', request) # identify by phone number
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))

        driver = Driver.objects.filter(email=email).first() 
        if driver is None:
            return HttpResponseBadRequest("No driver with email \"{}\" in our database".format(email))
        driver.route = None # driver does not have a route anymore -- they're ready!

        ride = self.get_available_ride(driver) 
        return Response(RideSerializer(ride).data, status=201)

def dispatcher(request):
    template = loader.get_template('dispatcher.html')
    context = {
        'students': Student.objects.all(),
        'rides': Ride.objects.order_by('priority'),
        'drivers': Driver.objects.filter(license_plate__isnull=False),
    }
    return render(request, 'dispatcher.html', context)
