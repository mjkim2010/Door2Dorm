import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import axios from 'axios';
import { ReadItem } from "./databaseHelper";
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import { LocationContext } from '../locationContext.js';

const RequestPage = (props) => {
  const [numRiders, setNumRiders] = useState("");
  const [safetyLevel, setSafetyLevel] = useState("");
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [originLat, setOriginLat] = useState("");
  const [originLong, setOriginLong] = useState("");
  const [destLat, setDestLat] = useState("");
  const [destLong, setDestLong] = useState("");
  const [mapLat, setMapLat] = useState("");
  const [mapLong, setMapLong] = useState("");
  const [cnt, increment] = useState(0);

  useEffect (() => {
    getInitialLocation();
  }, []);

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
      setMapLat(location.coords.latitude);
      setMapLong(location.coords.longitude);
    }
  }

  const mapView = () => {
    return (
      <View>
        <View style={styles.message}>
          <Text>You may drag the pins to adjust the pickup/dropoff location. </Text>
        </View>
        <MapView
        region={{
          latitude: mapLat ? mapLat : originLat,
          longitude: mapLong ? mapLong : originLong,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        }}
        initialRegion={{
          latitude: originLat,
          longitude: originLong,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
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

  const forceUpdate = () => {
    increment (cnt + 1);
  }
  
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
        onEndEditing
      />
    );
  }

  const getPermission = async() => {
    let perm;
    while (!perm || perm.status !== 'granted')
      {
        perm = await Permissions.askAsync(Permissions.LOCATION);
      }
  }

  const logoutButton = () => props.history.push('/loginRider');
  
  const getLocationAsync = async () => {
    return await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
  }

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
      setMapLat(location.latitude);
      setMapLong(location.longitude);
    }
  }

  const onDragEndDest = async (e) => {
    const coord = e.nativeEvent.coordinate;
    const addrs = await Location.reverseGeocodeAsync(coord);
    setDestLat(coord.latitude);
    setDestLong(coord.longitude);
    setMapLat(coord.latitude);
    setMapLong(coord.longitude);
    const addr = addrs[0];
    setDest(addr.name + ", " + addr.city + ", " + addr.region + " " + addr.postalCode);
  }

  const onDragEndOrigin = async (e) => {
    const coord = e.nativeEvent.coordinate;
    const addrs = await Location.reverseGeocodeAsync(coord);
    setOriginLat(coord.latitude);
    setOriginLong(coord.longitude);
    setMapLat(coord.latitude);
    setMapLong(coord.longitude);
    const addr = addrs[0];
    setOrigin(addr.name + ", " + addr.city + ", " + addr.region + " " + addr.postalCode);
  }

  const verify = () => {
    var numPassengers = /^\d{1}$/;
    var safetyNum = /^\d{1}$/;

    if (origin.length < 1) {
      alert("You must enter a current location")
    } else if (dest.length < 1) {
      alert("You must enter a destination")
    } else if (!numRiders.match(numPassengers)) {
      alert("Double check your number of riders is a digit less than 5")
    } else if (!safetyLevel.match(safetyNum)) {
      alert("Double check your safety level is a digit between 1 and 9")
    }
  }

  const requestButton = async (setLocations) => {
    verify(); 
    const sunet = await ReadItem("sunet");
    const url = 'http://127.0.0.1:8000/rides/placeholder/cr-ride/';

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

    setLocations(body.origin_lat, body.origin_long, body.dest_lat, body.dest_long, body.origin, body.dest);

    axios.post(url, body)
      .then(function(res) {
        console.log('Response received\n');
        console.log(res.data);
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

  return (
    <SafeAreaView>
        <View style={styles.back}>
            <Button
              onPress={logoutButton}
              title="Back"
              accessibilityLabel="Back"
              color='black'
            />
        </View>
        <View>
            {mapView ()}
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
                placeholder="Ex: 9 is emergency."
                placeholderTextColor="#a3aaad"
                onChange={(e) => setSafetyLevel (e.nativeEvent.text)}
              />
            </View>
            <LocationContext.Consumer>
          {({ setLocations }) => {
              return (
                <TouchableOpacity 
                  onPress={() => {
                    requestButton(setLocations)}
                  }
                  style={styles.button}>
                  <Text style={{ alignSelf: 'center' }}> Request Ride </Text>
                </TouchableOpacity>
              )
            }
          }
      </LocationContext.Consumer>
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
    height: Dimensions.get('window').height/2.8,
    marginBottom: 10,
  },
  back: {
    alignItems: "flex-start",
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
  message: {
    marginTop: 5,
    marginLeft: 10,
  },
});

export default RequestPage;
