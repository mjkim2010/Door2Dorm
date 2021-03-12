#!/bin/sh
curl -X POST -H "Content-Type: application/json" -d @fake_driver.json http://127.0.0.1:8000/drivers/placeholder/cr-driver/
