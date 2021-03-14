#!/bin/sh
echo "WELL-FORMED JSON QUERIES"
echo "-----------"
echo "Student:"
./scripts/test_student.sh well_formed_json/student.json
echo "\n\n"
echo "Ride:"
./scripts/test_ride.sh well_formed_json/ride.json
echo "\n\n"
echo "Driver:"
./scripts/test_driver.sh well_formed_json/driver.json
echo "\n\n"

echo "ERROR CHECKING"
echo "-----------"
echo "Student KeyError:"
./scripts/test_student.sh error_handling/student_keyerror.json
echo "\n\n"
echo "Ride KeyError:"
./scripts/test_ride.sh error_handling/ride_keyerror.json
echo "\n\n"
echo "Ride with SUNet that DoesNotExist:"
./scripts/test_ride.sh error_handling/sunet_does_not_exist_ride.json
echo "\n\n"
echo "Driver KeyError:"
./scripts/test_driver.sh error_handling/driver_keyerror.json
echo "\n\n"
