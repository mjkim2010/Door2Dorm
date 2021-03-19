from django.db import models
from datetime import datetime
from django.utils import timezone

class Student(models.Model):
    sunet = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=30)
    phone = models.PositiveIntegerField(default = 6503339999)
    password = models.CharField(max_length=30)

    def __str__(self):
        return "Student with Student ID {} made.".format(self.sunet) 

    # This function creates a new student to be added to the database
    @classmethod
    def create(cls, sunet, first, last, email, phone, password):
        return cls(sunet = sunet, first_name = first, last_name = last, email = email, phone = phone, password = password)


        
class Driver(models.Model):
    driver_license = models.CharField(max_length=30, default="FAKE980")
    first_name = models.CharField(max_length=30, default="first")
    last_name = models.CharField(max_length=30, default="last")
    email = models.EmailField(max_length=30, default="fake@fake.com")
    # The phone number of the driver currently serves as the unique identifier (id) for the driver
    phone = models.PositiveIntegerField(default = 6503339999)
    password = models.CharField(max_length=30)
    
    # If blank, driver is not active.
    license_plate = models.CharField(max_length=30, blank = True, default="IKEA980")
    
    # Contain a list of location objects
    route = models.TextField(default = '[]', null=True, blank=True)
    
    # Current location of the car
    current_lat = models.FloatField(default = 38.2393, null=True, blank=True)
    current_long = models.FloatField(default = -85.7598, null=True, blank=True)
    
    def __str__(self):
        return self.first_name + " " + self.last_name
    
    # This function creates a new driver to be added to the database
    @classmethod
    def create(cls, dl, first, last, email, phone, password):
        return cls(driver_license = dl, first_name = first, last_name = last, email = email, phone = phone, password = password)

class Ride(models.Model):
    # Each ride is linked to a Student object (the rider who requests the ride)
    student = models.ForeignKey(Student, on_delete = models.DO_NOTHING)
    
    # Each ride is also linked to a Driver object, which represents the driver assigned to this ride request
    driver = models.ForeignKey(Driver, on_delete=models.DO_NOTHING, null=True) # will be null if not assigned
    current_address= models.CharField(max_length=150)
    destination_address = models.CharField(max_length=150)
    current_lat = models.FloatField(default = 38.2393)
    current_long = models.FloatField(default = -85.7598)
    dest_lat = models.FloatField(default = 37.4254)
    dest_long = models.FloatField(default = -122.1629)

    # The fields 'num_passengers' and 'safety_lvl' values should be verified by the rider app to be
    # within the following range respectively: [1, 4] and [0, 10]
    num_passengers = models.IntegerField(default = 1)
    safety_lvl = models.PositiveIntegerField(default = 5)
    priority = models.FloatField(default = 50)
    time_requested = models.DateTimeField('time requested', default = timezone.now)

    # These fields are 'null' by default. When the student(s) is picked up, 'picked_up' and 'dropped_off'
    # are set accordingly to indicate the pickup and dropoff time.
    picked_up = models.DateTimeField(null = True, default = None) 
    dropped_off = models.DateTimeField(null = True, default = None)

    # Indicate if this ride has been assigned to a driver. This serves as a "lock" on this Ride object
    assigned = models.BooleanField(default = False)

    def __str__(self):
        return "Ride made."

    # This function creates a new ride request object to be added to the database
    @classmethod
    def create(cls, student, num_riders, safety_lvl, origin, origin_lat, origin_long, dest, dest_lat, dest_long):
        return cls(
            student = student,
            current_address = origin,
            destination_address = dest,
            num_passengers = num_riders,
            safety_lvl = safety_lvl,
            current_lat = origin_lat,
            current_long = origin_long,
            dest_lat = dest_lat,
            dest_long = dest_long
        )
    
class location(models.Model):
    # If the value 'is_picked_up' is True, this location refers to a pickup location.
    # Else, this location refers to a dropoff location
    is_picked_up = models.IntegerField(default = -1)

    # This links to a student (which is linked to a ride request)
    student = models.ForeignKey(Student, on_delete = models.DO_NOTHING)
