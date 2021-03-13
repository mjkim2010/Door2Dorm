from rest_framework.serializers import ModelSerializer

from .models import Student, Ride, Driver

class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class DriverSerializer(ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class RideSerializer(ModelSerializer):
    student = StudentSerializer(read_only=True)
    driver = DriverSerializer(read_only=True)
    class Meta:
        model = Ride
        fields = '__all__'

