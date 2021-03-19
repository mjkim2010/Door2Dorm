import React, { useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  Dimensions,
  Platform, 
  Linking
  } from 'react-native';
  import axios from 'axios';
  import { DriverContext } from '../driverContext.js';
  import MapView, { Polyline } from 'react-native-maps';
  import { Colors } from 'react-native/Libraries/NewAppScreen';
  import { decode } from "@mapbox/polyline";

/* The Dropoff Page renders when the Driver presses "Confirm Pickup" */
const DropOffPage = (props) => {
  /* The 'coords' in the state stores a list of coordinates (lat, long) for the directions 
     from the Driver's current location (which should be the pickup location) to the destination. */
  const [coords, setCoords] = useState([]);
  /* The DriverContext consists of the Driver current location, the Ride request object, and the Student
     associated with the Ride request object. */
  const context = useContext(DriverContext);

  /* This function finds the direction (in terms of a list of coordinates) from the driver's current location (pickup
    location) to the destination and add the coordinates to the 'coords' list in the state. */
  const findRouteCoords = async () => {
    let allCoords = [];
    getDirections(context.driverLat, context.driverLong, context.rideRequest.dest_lat, context.rideRequest.dest_long)
      .then(coordinates => {
        allCoords.push(...coordinates);
        setCoords(allCoords);
      })
      .catch(err => console.log ("Getting dir from driver to dest fails \n", err));
  }

  
  useEffect(()=> {
    /* This calls 'findRouteCoords' once when the page is first rendered. */
    findRouteCoords();
  }, []);

  const defaultDelta = 0.0122;
  const defaultDeltaMultiplier= 3;

  /* Given the NAME of the map marker, the LAT and LONG of where this map marker should location, and 
     the intended color of this map marker, create and return the MapView.Marker component. */
  const pin = (name, lat, long, color) => {
    return (
      <MapView.Marker 
        draggable={false}
        coordinate={{
          latitude: lat,
          longitude: long,
        }}
        title={name}
        pinColor={color}
      />
    );
  }

  /* Create the map that shows two pins (the Driver current location and the dropoff location) and the route from 
     the current location to the dropoff location. */
  const mapView = () => {
    const edge = defaultDelta * defaultDeltaMultiplier;
    return (
      <View>
        <MapView
          region={{
            latitude: (context.driverLat + context.rideRequest.dest_lat) / 2,
            longitude: (context.driverLong + context.rideRequest.dest_long) / 2,
            latitudeDelta: Math.abs(context.driverLat - context.rideRequest.dest_lat) + edge,
            longitudeDelta: Math.abs(context.driverLong - context.rideRequest.dest_long) + edge,
          }}
          style = {styles.map}
          showsUserLocation = {true}
          followUserLocation = {false}
          zoomEnabled = {true}
        >
          {coords.length > 0 && <Polyline coordinates={coords} />}
          {pin ("Dropoff Location", context.rideRequest.dest_lat, context.rideRequest.dest_long, 'green')}
          {pin ("Current Location", context.driverLat, context.driverLong, 'blue')}
        </MapView>
      </View>
    );
  }

  /* Combine the LAT and LONG into a string value delim-ed by a comma. */
  const getLatLongString = (lat, long) => {
    return lat + "," + long;
  }

  /* This function is called when the driver hits the "Drop Off" Button. It calls 
     'sendPostRequest' to tell the server that this ride request has been completed. */
  const droppedOff = () => {
    sendPostRequest(context.ride_id);
  }

  /* Sends a POST request to the server to notify that the ride request has been completed. */
  const sendPostRequest = (ride_id) => {
    // JSON file that will be sent to the POST endpoint
    let payload = {
      "ride_id": ride_id,
    }
    const url = 'http://127.0.0.1:8000/drivers/placeholder/dropped-off/';
    // const url = 'http://ec2-3-138-107-41.us-east-2.compute.amazonaws.com:8000/drivers/placeholder/dropped-off/';
    var self = this;
    axios.post(url, payload)
      .then(function(res) {
        console.log('Response received\n');
        console.log(res.data);
        /* If success, navigate the Driver to the Loading page where it waits for a ride assignment. */
        props.history.push("/loading");
      })
      .catch(function(err) {
        console.log("Error making the call");
        console.log(err);
        if (err.request) {
          console.log(err.request);
        }
      });
  }

  /* Check the platform and render a button, which when pressed, opens up the either Apple
     or Google Maps on the user's phone to navigate the Driver from his/her/their current location
     to the pickup location. */
  const openExternalMapButton = () => {
    const isIOS = Platform.OS === 'ios';
    const isAndroid = Platform.OS === 'android';
    if (!(isIOS || isAndroid)) {
      return null;
    }
    return (
        isIOS ? 
          <TouchableOpacity 
            onPress={() => {
              Linking.openURL(`maps://app?saddr=${context.driverLat}+${context.driverLong}&daddr=${context.rideRequest.dest_lat}+${context.rideRequest.dest_long}`);
              props.history.push("/dropoff");
            }}
            style={styles.button}>
            <Text> Open in Maps </Text>
          </TouchableOpacity> :
          <TouchableOpacity 
            onPress={() => {
              Linking.openURL(`google.navigation:q=${context.rideRequest.dest_lat}+${context.rideRequest.dest_long}`);
              props.history.push("/dropoff");
            }}
            style={styles.button}>
              <Text> Open in Maps </Text>
          </TouchableOpacity>
      );
  }

  /* Given the origin lat/long and the destination lat/long, this function, 
  called by 'findRouteCoords', sends a request to the Google Maps API to get the direction 
  from the origin to the destination. Upon success, this returns a list of coordinates that 
  represents the route. */
  const getDirections = async (fromLat, fromLong, toLat, toLong) => {
    const startLoc = getLatLongString (fromLat, fromLong);
    const destinationLoc = getLatLongString (toLat, toLong);
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

  /* Render the Dropoff Page. */
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Drop off {context.student.first_name} {context.student.last_name} at {context.rideRequest.destination_address}</Text>
            <View style={styles.buttonContainer}>
              {openExternalMapButton()} 
              {mapView()}
              <TouchableOpacity onPress={droppedOff} style={styles.button}>
                  <Text> Dropped Off </Text>
              </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%'
  },
  sectionTitle: {
    textAlign: 'center',
    marginHorizontal: 32,
    marginVertical: 32,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  buttonContainer: {
    alignSelf: 'center',
    justifyContent:"flex-start",
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/2.2,
  },
  button: {
    backgroundColor: '#55D7F5',
    borderRadius: 11,
    color: 'black',
    overflow: 'hidden',
    textAlign:'center',
    width: 150,
    height: 40,
    margin: 10,
    alignItems: "center",
    padding: 10,
    marginTop: 30,
  },
});
  
  export default DropOffPage;