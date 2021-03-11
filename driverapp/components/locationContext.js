import React from 'react';

export const LocationContext = React.createContext({
    cur_lat: "",
    setLat: () => {},
    cur_long: "",
    setLong: () => {}
});