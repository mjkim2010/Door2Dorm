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
from django.utils import timezone

"""
Given a POST REQUEST object, the NAME of key in REQUEST, and VAL_TYPE, this function 
returns the found value as the correct type.
"""
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

    """
    This creates a HTTP post request endpoint '<host>/students/<placeholder>/cr-student/'
    for creating a Student object, where <host> can be either a localhost server address (e.g. localhost:8000)
    or an EC2 server address
    """
    @action(methods=['post'], detail=True,
            url_path='cr-student', url_name='create_student')
    def cr_student_func(self, request, pk=None):

        # Attempts to get all the necessary info for creating a Student object from the post request 
        try:
            sunet = get_value("sunet", 'str', request)
            first = get_value("first", 'str', request)
            last = get_value("last", 'str', request)
            phone = get_value("phone", 'int', request)
            password = get_value("password", 'str', request)
        # Return an error if missing fields in the request
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))


        # Create a Student object
        student = Student.create(
            sunet,
            first,
            last,
            sunet + "@stanford.edu",
            phone,
            password
        )
        # Save the Student to the database
        student.save()
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=201)

class RideViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RideSerializer
    queryset = Ride.objects.all()

    """
    This creates a HTTP post request endpoint '<host>/rides/<placeholder>/cr-ride/'
    for creating a Ride request object, where <host> can be either a localhost server address 
    (e.g. localhost:8000) or an EC2 server address
    """
    @action(methods=['post'], detail=True,
            url_path='cr-ride', url_name='create_ride')
    def cr_ride_func(self, request, pk=None):
        # Attempts to get all the necessary info for creating a Ride object from the post request 
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
        # Return an error if missing fields in the request
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))

        # Find the Student object with the 'sunet' provided in the ride creation post request
        student = Student.objects.filter(sunet=sunet).first() #TODO: add a check to make sure the student exists in the database
        if student is None:
            return HttpResponseBadRequest("The sunet \"{}\" does not match a rider in our database".format(sunet))

        # Create the Ride object
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
        # Save the Ride object to the database
        ride.save()
        serializer = RideSerializer(ride)
        return Response(serializer.data, status=201)

class DriverViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = DriverSerializer 
    queryset = Driver.objects.all()

    """
    This creates a HTTP post request endpoint '<host>/drivers/<placeholder>/cr-ride/'
    for creating a Driver object, where <host> can be either a localhost server address 
    e.g. localhost:8000) or an EC2 server address
    """
    @action(methods=['post'], detail=True,
            url_path='cr-driver', url_name='create_driver')
    def cr_driver_func(self, request, pk=None):
        # Attempts to get all the necessary info for creating a Driver object from the post request 
        try:
            first = get_value("first", 'str', request)
            last = get_value("last", 'str', request)
            email = get_value("email", 'str', request)
            phone = get_value("phone", 'int', request)
            dl = get_value("license", 'str', request)
            pwd = get_value("password", 'str', request)
        # Return an error if missing fields in the request
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))

        # Create the Driver object
        driver = Driver.create(dl,
            first,
            last,
            email,
            phone,
            pwd)

        # Save the Driver object to the database
        driver.save()
        serializer = DriverSerializer(driver)
        return Response(serializer.data, status=201)

    """
    Grabs the oldest request for a ride that hasn't been assigned. Atomic so that multiple
    drivers don't grab the same ride.
    """
    @transaction.atomic
    def get_available_ride(self):
        r = Ride.objects.filter(assigned=False).order_by('time_requested').first()
        if r is not None:
             r.assigned = True
             r.save()
        return r

    """
    Driver notifies the server that they are ready to pick up a ride by sending their phone number.
    Server responds with a potential Ride, or None if there is no ride available.
    """
    @action(methods=['post'], detail=True,
            url_path='ask-assignment', url_name='ask_assignment')
    def ask_for_assignment(self, request, pk=None):
        # Get the Driver phone number from the post request
        try:
            phone = get_value("driver_phone", 'int', request)
        # Return an error if missing 'driver_phone' field in the request
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))

        # Find the Driver object with the provided 'driver_phone'
        driver = Driver.objects.filter(phone=phone).first()

        # Driver with that phone number is not found in the database
        if driver is None:
            return HttpResponseBadRequest("No driver with phone number \"{}\" in our database".format(phone))

        # Find an available ride and return serialized data on the Ride object 
        # (which also consists of the Student object)
        ride = self.get_available_ride() 
        return Response(RideSerializer(ride).data, status=201)

    """
    Driver sends their PHONE_NUMBER and the RIDE_ID of the possible assignment. The Server
    links the Driver to the Ride and returns the Ride object.
    """
    @action(methods=['post'], detail=True,
            url_path='accept-assignment', url_name='accept_assignment')
    def accept_assignment(self, request, pk=None):
        # Get 'driver_phone' and 'ride_id' which serves as unique identifier for 
        # a Driver and Ride object respectively
        try:
            phone = get_value("driver_phone", 'int', request)
            ride_id = get_value("ride_id", 'int', request)
        # Return an error if missing 'driver_phone' and/or 'ride_id' fields in the request
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))

        # Find the Ride object with the provided 'ride_id'
        r = Ride.objects.filter(id=ride_id).first() 
        # Rider with that ride_id is not found in the database
        if r is None:
            return HttpResponseBadRequest("No ride with id \"{}\" in our database".format(ride_id))

        # Find the Driver object with the provided 'driver_phone'   
        driver = Driver.objects.filter(phone=phone).first()
        # Driver with that phone number is not found in the database
        if driver is None:
            return HttpResponseBadRequest("No driver with phone number \"{}\" in our database".format(phone))

        # Set driver of ride to be rider + save to database
        r.driver = driver 
        r.save()
        return Response(RideSerializer(r).data, status=201)

    """
    Driver sends the RIDE_ID of the possible assignment and the Server releases the assignment
    hold on the Ride.
    """
    @action(methods=['post'], detail=True,
            url_path='reject-assignment', url_name='reject_assignment')
    def reject_assignment(self, request, pk=None):
        # Get the 'ride_id' which serves as unique identifier for Ride object
        try:
            ride_id = get_value("ride_id", 'int', request)
        # Return an error if missing the 'ride_id' field in the request
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))

        # Find the Ride object with the provided 'ride_id'
        r = Ride.objects.filter(id=ride_id).first() 
        if r is None:
            return HttpResponseBadRequest("No ride with id \"{}\" in our database".format(ride_id))
        # Unassigned to the driver and save it to the database
        r.assigned = False
        r.save()
        return Response(RideSerializer(r).data, status=201)

    """
    Driver sends the RIDE_ID. Database records that ride has started and returns the updated Ride object.
    """
    @action(methods=['post'], detail=True,
            url_path='picked-up', url_name='picked_up')
    def picked_up(self, request, pk=None):
        # Get the 'ride_id' which serves as unique identifier for Ride object
        try:
            ride_id = get_value("ride_id", 'int', request)
        # Return an error if missing the 'ride_id' field in the request
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))
        # Find the Ride object with the provided 'ride_id'
        ride = Ride.objects.filter(id=ride_id, picked_up=None).first()
        if ride is None:
            return HttpResponseBadRequest("No active ride found with id {}".format(ride_id))
        # Set the pickup time and save to database
        ride.picked_up = timezone.now()
        ride.save()
        return Response(RideSerializer(ride).data, status=201)

    """
    Driver sends the RIDE_ID. Database records that ride has ended and returns the updated Ride object.
    """
    @action(methods=['post'], detail=True,
            url_path='dropped-off', url_name='dropped_off')
    def dropped_off(self, request, pk=None):
        # Get the 'ride_id' which serves as unique identifier for Ride object
        try:
            ride_id = get_value("ride_id", 'int', request)
        # Return an error if missing the 'ride_id' field in the request
        except KeyError as e:
            return HttpResponseBadRequest("Missing field {} in request".format(e.args[0]))
        # Find the Ride object with the provided 'ride_id'
        ride = Ride.objects.filter(id=ride_id, dropped_off=None).first()
        if ride is None:
            return HttpResponseBadRequest("No active ride found with id {}".format(ride_id))
        # Set the dropoff time and save to database
        ride.dropped_off = timezone.now()
        ride.save()
        return Response(RideSerializer(ride).data, status=201)
"""
Return the Dispatcher View with the most updated information on the Student,
Ride, and Driver objects.
"""
def dispatcher(request):
    template = loader.get_template('dispatcher.html')
    context = {
        'students': Student.objects.all(),
        'rides': Ride.objects.order_by('priority'),
        'drivers': Driver.objects.filter(license_plate__isnull=False),
    }
    return render(request, 'dispatcher.html', context)
