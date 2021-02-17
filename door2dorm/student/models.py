from django.db import models
import uuid

# Create your models here.
class Student(models.Model):
    id = models.UUIDField( 
        primary_key = True, 
        default = uuid.uuid4, 
        editable = False
    ) 
    student_id = models.PositiveIntegerField()
    sunet = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=30)
    phone = models.PositiveIntegerField()

    def __str__(self):
        return "Student with Student ID {} made".format(self.student_id) 
