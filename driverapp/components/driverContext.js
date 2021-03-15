import React from 'react';

export const DriverContext = React.createContext({
    ride_id: "",
    rideRequest: {},
    student: {},

    setNumber: () => {},
    setRideID: () => {},
    setRideRequest: () => {},
    setStudent: () => {},

    driverLat: "",
    driverLong: "",
    driverLoc: ""
});