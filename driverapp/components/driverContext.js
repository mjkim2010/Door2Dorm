import React from 'react';

export const DriverContext = React.createContext({
    driver_phone_number: "",
    setNumber: () => {},
    ride_id: "",
    setRideID: () => {},
});