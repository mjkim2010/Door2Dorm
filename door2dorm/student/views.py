from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Student

def index(request):
    template = loader.get_template('student/index.html')
    context = { 
        
    }
    return render(request, 'student/index.html', context)
