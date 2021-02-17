from django.db import models
import uuid

# Create your models here.
class Ride(models.Model):
    sunet = models.CharField(max_length=30)
    time_requested = models.DateTimeField('time requested')
    num_passengers = models.IntegerField(default=1)

    def __str__(self):
        return self.sunet + " requested at {} for {} passengers".format(self.time_requested, self.num_passengers) 

class Student(models.Model):
    id = models.UUIDField( 
        primary_key = True, 
        default = uuid.uuid4, 
        editable = False, 
        unique = True,
    ) 
    student_id = models.PositiveIntegerField()
    sunet = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=30)
    phone = models.PositiveIntegerField()

    def __str__(self):
        return "Student with Student ID {} made. It has the unique id of {}".format(self.student_id, self.id) 