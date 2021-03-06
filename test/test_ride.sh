#!/bin/sh
curl -X POST -H "Content-Type: application/json" -d @fake_ride.json http://127.0.0.1:8000/rides/placeholder/cr-ride/
