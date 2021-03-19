import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { LocationContext } from '../locationContext.js';
import { decode } from "@mapbox/polyline";

/* The EtaPage renders after the Rider presses the "Request" button to request a ride. */
const EtaPage = (props) => {
  const { originLat, originLong, destLat, destLong, origin, dest } = props;
  const [queuePosition, setQueuePosition] = useState(4);
  const [timeLeft, setTimeLeft] = useState(17);
  const [coords, setCoords] = useState([]);

  useEffect (() => {
    /* This calls 'getDirections' once when the page is first rendered, in order to get the 
       direction from the pickup location to the dropoff location (as a list of coordinates) . */
    getDirections()
      .then(coordinates => setCoords (coordinates))
      .catch(err => console.log ("Something went wrong."));
  }, []);

  const defaultDelta = 0.0122;
  const defaultDeltaMultiplier= 3;

  /* This navigate the rider to the Request page. 
     TODO: This requests a POST request to the server to remove this Ride request object from
     the database and cancel any assignment. */
  const leaveQueue = () => props.history.push("/rideRequest");

  /* This sends a request to the Google Maps API to get the direction 
  from the origin to the destination. Upon success, this returns a list of coordinates that 
  represents the route. */
  const getDirections = async () => {
    const startLoc = getLatLongString (originLat, originLong);
    const destinationLoc = getLatLongString (destLat, destLong);
    try {
      const KEY = "AIzaSyCtFAsi3z_lYe66Ad9nMTU6CVLVvtdDdKM";
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`
      );
      let respJson = await resp.json();
      let points = decode(respJson.routes[0].overview_polyline.points);
      let coordindates = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      return coordindates;
    } catch (error) {
      return error;
    }
  };

  /* Combine the LAT and LONG into a string value delim-ed by a comma. */
  const getLatLongString = (lat, long) => {
    return lat + "," + long;
  }

  /* Given the NAME of the map marker, the LAT and LONG of where this map marker should location, 
     create and return the MapView.Marker component. Note that destination marker is red whereas the 
     marker for the origin is green. */
  const pin = (name, lat, long) => {
    return (
      <MapView.Marker 
        draggable={false}
        coordinate={{
          latitude: lat,
          longitude: long,
        }}
        title={name}
        pinColor={name == 'Destination' ? 'red' : 'green'}
      />
    );
  }

  /* Create the map that shows two pins: 1) the pickup location and 2) the dropoff 
     location) and a route from the pickup location to the dropoff location */
  const getMap = (originLat, originLong, destLat, destLong) => {
    let originLatNum = Number(originLat)
    let originLongNum = Number(originLong)

    const edge = defaultDelta * defaultDeltaMultiplier;
    return (
      <>
        <MapView
          region={{
            latitude: (originLat + destLat) / 2,
            longitude: (originLong + destLong) / 2,
            latitudeDelta: Math.abs(originLat - destLat) + edge,
            longitudeDelta: Math.abs(originLong - destLong) + edge,
          }}
          initialRegion={{
            latitude: originLatNum,
            longitude: originLongNum,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style = {styles.map}
          showsUserLocation = {true}
          followUserLocation = {false}
          zoomEnabled = {true}>
          {coords.length > 0 && <Polyline coordinates={coords} />}
          {pin ("Origin", originLat, originLong)}
          {pin ("Destination", destLat, destLong)}
        </MapView>
      </>
    );
  }

  /* Renders the EtaPage displaying relevant information about the Ride Request (route, queue status, driver information)
     and a button allowing the student to leave the queue. */
  return (
    <View style={styles.body}>
      <LocationContext.Consumer>
      {({ originLat, originLong, destLat, destLong }) => getMap (originLat, originLong, destLat, destLong)}
    </LocationContext.Consumer>
      <View>
        <Text style={styles.confirmation}>Your ride is registered! Current wait time is approximately {timeLeft} minutes.</Text>
        <Text style={styles.detailTitle}>Ride Details</Text>
        <View style={styles.message}>
          <Text>Queue positon: {queuePosition}</Text>
          <Text>Driver's name: TBD </Text>
          <Text>License plate: TBD </Text>

          {/* TODO: Update these addresses from ridePage.js */}
          <Text>From: {origin}</Text>
          <Text>To: {dest} </Text>
        </View>
        <Text style={styles.detailTitle}>Notes</Text>
        <View style={styles.message}>
          <Text>We will let you know when a driver is assigned. Please call 911 if you are feeling unsafe.</Text>
        </View>
      </View>
      <TouchableOpacity onPress={leaveQueue} style={styles.button}>
            <Text style={{ alignSelf: 'center' }}> Leave queue </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmation: {
    fontSize: 30,
    marginLeft: 10,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  message: {
    marginTop: 5,
    marginLeft: 10,
  },
  detailTitle: {
    marginTop: 10,
    marginLeft: 10,
    color: 'gray',
    fontWeight: 'bold',
  },  
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/2.2,
  },
  button: {
    backgroundColor: '#f26d64',
    borderRadius: 11,
    color: 'black',
    overflow: 'hidden',
    textAlign:'center',
    width: 150,
    height: 40,
    margin: 10,
    alignSelf: "center",
    padding: 10,
    marginTop: 20,
  },
});

export default EtaPage;
