from django.db import models
from datetime import datetime
# import uuid  // Maybe to be added later

# Create your models here.
class Student(models.Model):
    # id = models.UUIDField( 
    #     primary_key = True, 
    #     default = uuid.uuid4, 
    #     editable = False, 
    #     unique = True,
    # ) 
    student_id = models.PositiveIntegerField()
    sunet = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=30)
    phone = models.PositiveIntegerField()

    def __str__(self):
        return "Student with Student ID {} made. It has the unique id of {}".format(self.student_id, self.id) 


class Ride(models.Model):
    # id = models.UUIDField( 
    #     primary_key = True, 
    #     default = uuid.uuid4, 
    #     editable = False, 
    #     unique = True,
    # )
    student_id = models.PositiveIntegerField(default = 1233242)
    current_lat = models.FloatField(default = 38.2393)
    current_long = models.FloatField(default = -85.7598)
    dest_lat = models.FloatField(default = 37.4254)
    dest_long = models.FloatField(default = -122.1629) 
    num_passengers = models.IntegerField(default = 1) # TODO: Add validator to restrict range [1, 4]
    safety_lvl = models.PositiveIntegerField(default = 5) # TODO: Add validator to restrict range [0, 10]
    priority = models.FloatField(default = 50) # TODO: Add validator to restrict range [0, 100]
    time_requested = models.DateTimeField('time requested', default = datetime.now)
    picked_up = models.DateTimeField(null = True, default = datetime.min)
    dropped_off = models.DateTimeField(null = True, default = datetime.min)
    assigned = models.IntegerField(default = -1)

    def __str__(self):
        return "Ride made."

