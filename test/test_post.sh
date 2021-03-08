#!/bin/sh
params="student_id=1&sunet=pb&first=p&last=b&email=pb@cs.stanford.edu&phone=0123456789"
curl -X POST -H "Content-Type: application/json" -d @fake_student.json http://127.0.0.1:8000/students/placeholder/cr-student/
