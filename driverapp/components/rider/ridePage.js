import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import * as Permissions from 'expo-permissions';

import axios from 'axios';
import { ReadItem } from "./databaseHelper";
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { LocationContext } from '../locationContext.js';

/* The RequestPage is rendered after the student registers or logs in, and this allows the
   student to enter information for requesting a ride. */
const RequestPage = (props) => {
  const [numRiders, setNumRiders] = useState("");
  const [safetyLevel, setSafetyLevel] = useState("");
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [originLat, setOriginLat] = useState("");
  const [originLong, setOriginLong] = useState("");
  const [destLat, setDestLat] = useState("");
  const [destLong, setDestLong] = useState("");

  useEffect (() => {
    /* This calls 'getInitialLocation' once when the page is first rendered in order to set the 
       student's current location. */
    getInitialLocation();
  }, []);

  /* This function gets the current location (lat, long) of the student and then convert
     this to an address via reverseGeocode. Then it set 'origin', 'originLat', and 'originLong' 
     in the state accordingly. */
  const getInitialLocation = async () => {
    getPermission();
    const location = await getLocationAsync();
    if (location) {
      const lat = location.coords.latitude;
      const long = location.coords.longitude;
      const addrs = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: long,
      });
      const addr = addrs[0];
      setOrigin(addr.name + ", " + addr.city + ", " + addr.region + " " + addr.postalCode);
      setOriginLat(location.coords.latitude);
      setOriginLong(location.coords.longitude);
    }
  }

  const defaultDelta = 0.0122;
  const defaultDeltaMultiplier= 3;

  /* Create the map that two pins: 1)the pickup location and 2) the dropoff 
     location if they are defined. This map will show the pickup location (zoomed in) 
     when the dropoff lat/long are not yet defined. Otherwise, it shows both pins. */
  const mapView = () => {
    const edge = defaultDelta * defaultDeltaMultiplier;
    return (
      <View>
        <MapView
        region={{
          latitude: originLat && destLat ? ((originLat + destLat) / 2) : originLat,
          longitude: originLong && destLong ? ((originLong + destLong) / 2) : originLong,
          latitudeDelta: originLat && destLat ? Math.abs(originLat - destLat) + edge: defaultDelta,
          longitudeDelta: originLong && destLong ? Math.abs(originLong - destLong) + edge : defaultDelta,
        }}
        initialRegion={{
          latitude: originLat,
          longitude: originLong,
          latitudeDelta: defaultDelta,
          longitudeDelta: defaultDelta,
        }}
        style = {styles.map}
        showsUserLocation = {true}
        followUserLocation = {false}
        zoomEnabled = {true}
        >
          {originLat && originLong ? pin ("Origin", originLat, originLong, onDragEndOrigin) : null}
          {destLat && destLong ? pin ("Destination", destLat, destLong, onDragEndDest): null}
        </MapView>
      </View>
      
    );
  }
  
  /* Given the NAME of the map marker and the LAT and LONG of where this map marker should location,
     create and return the draggable MapView.Marker component. Note that the destination will have a red
     pin while the origin will have a green pin. */
  const pin = (name, lat, long, onDragEndHandler) => {
    return (
      <MapView.Marker 
        draggable={true}
        coordinate={{
          latitude: lat,
          longitude: long,
        }}
        title={name}
        onDragEnd={onDragEndHandler}
        pinColor={name == 'Destination' ? 'red' : 'green'}
      />
    );
  }

  /* Get the permission from the user to get his/her/their current location. */
  const getPermission = async() => {
    let perm;
    while (!perm || perm.status !== 'granted')
      {
        perm = await Permissions.askAsync(Permissions.LOCATION);
      }
  }

  /* Logs out the user by navigating the user to the RiderLoginPage. */
  const logoutButton = () => props.history.push('/loginRider');
  
  /* Gets the current location of the student. */
  const getLocationAsync = async () => {
    return await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
  }

  /* Given the name (either 'pickup' or 'dropoff'), converts an address into lat/long
     and set those values accordingly in the state given the setLatFunc() and setLongFunc(). */
  const convertToLatLong = async (name, setLatFunc, setLongFunc) => {
    getPermission();
    const whichLocation = name == 'pickup' ? origin : dest;
    const locations = await Location.geocodeAsync(whichLocation);
    if (!locations || locations.length == 0) {
      alert(`Please enter a valid ${name} address.\n`);
    } else {
      const location = locations[0];
      setLatFunc(location.latitude);
      setLongFunc(location.longitude);
    }
  }

  /* This function is called when the user drags the destination pin. This function set the new 'destLat'
     and 'destLong' in the state. It also turns the (lat, long) into a human readable address and set 'dest' accordingly. */
  const onDragEndDest = async (e) => {
    const coord = e.nativeEvent.coordinate;
    const addrs = await Location.reverseGeocodeAsync(coord);
    setDestLat(coord.latitude);
    setDestLong(coord.longitude);
    const addr = addrs[0];
    setDest(addr.name + ", " + addr.city + ", " + addr.region + " " + addr.postalCode);
  }

  /* This function is called when the user drags the origin pin. This function set the new 'originLat'
     and 'originLong' in the state. It also turns the (lat, long) into a human readable address and set 'origin' accordingly. */
  const onDragEndOrigin = async (e) => {
    const coord = e.nativeEvent.coordinate;
    const addrs = await Location.reverseGeocodeAsync(coord);
    setOriginLat(coord.latitude);
    setOriginLong(coord.longitude);
    const addr = addrs[0];
    setOrigin(addr.name + ", " + addr.city + ", " + addr.region + " " + addr.postalCode);
  }

  /* Verifies the input that both pickup and dropoff are filled out. Also verifies that the
     number of passengers is within the [1,4] range and that the safety level is between the [1,9] range.
     TODO: Need to verify that they are actually valid addresses.  */
  const verify = () => {
    var numPassengers = /^\d{1}$/;
    var safetyNum = /^\d{1}$/;

    if (origin.length < 1) {
      alert("You must enter a current location")
    } else if (dest.length < 1) {
      alert("You must enter a destination")
    } else if (!numRiders.match(numPassengers) || numRiders < 1 || numRiders > 4) {
      alert("Double check your number of riders is a digit less than 5")
    } else if (!safetyLevel.match(safetyNum) || safetyLevel < 1 || safetyLevel > 9) {
      alert("Double check your safety level is a digit between 1 and 9")
    }
  }

  /* Given the information about the ride request in the state, send a POST HTTP request 
     to create a Ride request object in the database. */
  const requestButton = async (setLocations) => {
    verify(); 
    const sunet = await ReadItem("sunet");
    const url = 'http://127.0.0.1:8000/rides/placeholder/cr-ride/';
    // const url = 'http://ec2-3-138-107-41.us-east-2.compute.amazonaws.com:8000/rides/placeholder/cr-ride/';
    
    let curLocation = getLocationAsync();
    if (!curLocation)
      {
        alert("Cannot access your location.\n");
        return;
      }
    const body = {
      sunet: sunet,
      num_riders: numRiders,
      safety_level: safetyLevel,
      origin: origin,
      origin_lat: originLat,
      origin_long: originLong,
      dest: dest,
      dest_lat: destLat, 
      dest_long: destLong,
    };

    /* Set the location for the rider app. */
    setLocations(body.origin_lat, body.origin_long, body.dest_lat, body.dest_long, body.origin, body.dest);

    /* Send the POST request. */
    axios.post(url, body)
      .then(function(res) {
        console.log('Response received\n');
        console.log(res.data);
        /* If successful, navigate the rider to the EtaPage. */
        props.history.push('/eta');
      })
      .catch(function(err) {
        console.log("Error making the call");
        console.log(err);
        if (err.request) {
          console.log(err.request);
        }
      });
  }

  /* Render the Ride Request page. */
  return (
    <SafeAreaView>
        <View style={styles.buttonContainer}>
          <View style={styles.back}>
              <Button
                onPress={logoutButton}
                title="Back"
                accessibilityLabel="Back"
                color='black'
              />
          </View>
          <LocationContext.Consumer>
            {({ setLocations }) => {
                return (
                  <Button
                    onPress={() => {
                      requestButton(setLocations)}
                    }
                    title="Request"
                    accessibilityLabel="Request"
                    color='black'
                  />
                )
              }
            }
          </LocationContext.Consumer>
        </View>  
        <View>
            <View style={styles.inputView}>
              <Text style={styles.sectionTitle}>Pickup address</Text>
              <TextInput
                value={origin}
                props={commonProps}
                style={styles.textInput}
                onChange={(e) => setOrigin (e.nativeEvent.text)}
                onEndEditing={() => convertToLatLong("pickup", setOriginLat, setOriginLong)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={styles.sectionTitle}>Destination address</Text>
              <TextInput
                placeholder="Ex: 123 Stanford Dr, Taft, CA 12345"
                placeholderTextColor="#a3aaad"
                value={dest}
                props={commonProps}
                style={styles.textInput}
                onChange={(e) => setDest (e.nativeEvent.text)}
                onEndEditing={() => convertToLatLong("dropoff", setDestLat, setDestLong)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={styles.sectionTitle}>Number of riders (1-4)</Text>
              <TextInput
                keyboardType={'number-pad'}
                style={styles.textInput}
                onChange={(e) => setNumRiders (e.nativeEvent.text)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={styles.sectionTitle}>Safety level (1-9)</Text>
              <TextInput
                keyboardType={'number-pad'}
                style={styles.textInput}
                onChange={(e) => setSafetyLevel (e.nativeEvent.text)}
              />
            </View>
            <View>
              <Text style={styles.note}>Note: Dragging the pin will edit the pickup/dropoff locations.</Text>
            </View>
            {mapView ()}
        </View>
      </SafeAreaView>
  );
}
  
const commonProps = {
  autoCapitalize: 'none',
  autoCompleteType: 'off',
  autoCorrect: false,
  spellCheck: false,
}

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: Dimensions.get('window').width - 20,
    height: 60,
    borderWidth: 1,
    borderColor: '#ebeff1',
    marginLeft: 10,
    marginRight: 10,
    shadowOpacity: 0.1,
    marginBottom: 10,
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/1.5,
  },
  back: {
    alignItems: "flex-start",
  },
  request: {
    alignItems: "flex-end",
  },
  sectionTitle: {
    alignItems: "flex-start",
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#55D7F9',
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
    alignSelf: 'center',
    padding: 10,
  },
  note: {
    color: 'gray',
    marginLeft: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
  }
});

export default RequestPage;
