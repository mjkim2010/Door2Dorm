from rest_framework.serializers import ModelSerializer

from .models import Student, Ride, Driver

class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class RideSerializer(ModelSerializer):
    class Meta:
        model = Ride
        fields = '__all__'


class DriverSerializer(ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'
