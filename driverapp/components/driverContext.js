import React from 'react';

export const DriverContext = React.createContext({
    ride_id: "",
    driver_phone_number: "",
    originLat: "",
    originLong: "",
    destLat: "",
    destLong: "",
    origin: "",
    dest: "",

    setNumber: () => {},
    setRideID: () => {},
    setLocations: () => {},

    driverLat: "",
    driverLong: "",
    driverLoc: ""
});