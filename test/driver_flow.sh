#!/bin/sh
python3 ../door2dorm/manage.py flush # need all the ids to start at 1
python3 ../door2dorm/manage.py runserver > ./server.log 2>&1 &
SERVER_PID=$!
echo "Starting server...\n\n"
sleep 5
echo "Create Student"
./scripts/test_student.sh well_formed_json/student.json
echo "\n\n"
echo "Create Driver:"
./scripts/test_driver.sh well_formed_json/driver.json
echo "\n\n"
echo "Create Ride Request:"
./scripts/test_ride.sh well_formed_json/ride.json
echo "\n\n"
echo "Driver requests Ride assignment:"
curl -X POST -H "Content-Type: application/json" -d '{"driver_id": 1}' http://127.0.0.1:8000/drivers/placeholder/ask-assignment/
echo "\n\n"
echo "Driver accepts Ride assignment:"
curl -X POST -H "Content-Type: application/json" -d '{"driver_id": 1, "ride_id":1}' http://127.0.0.1:8000/drivers/placeholder/accept-assignment/
echo "\n\n"
echo "Driver picks up Ride assignment:"
curl -X POST -H "Content-Type: application/json" -d '{"ride_id":1}' http://127.0.0.1:8000/drivers/placeholder/picked-up/
echo "\n\n"
echo "Wait 2 seconds"
sleep 2
echo "\n\n"
echo "Driver drops off Ride assignment:"
curl -X POST -H "Content-Type: application/json" -d '{"ride_id":1}' http://127.0.0.1:8000/drivers/placeholder/dropped-off/
kill -9 $SERVER_PID 
