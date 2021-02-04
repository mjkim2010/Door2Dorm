from django.db import models

# Create your models here.
class Ride(models.Model):
    sunet = models.CharField(max_length=30)
    time_requested = models.DateTimeField('time requested')
    num_passengers = models.IntegerField(default=1)

    def __str__(self):
        return self.sunet + " requested at {} for {} passengers".format(self.time_requested, self.num_passengers) 
