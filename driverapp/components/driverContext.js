import React from 'react';

/* Consists of the Driver info (phone number and location info), Ride object (that 
   the driver is assigned to), and the Student object associated with the Ride request. It
   also contains functions to set these information. */
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