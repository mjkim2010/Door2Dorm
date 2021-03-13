import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  Alert,
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { ReadItem } from "./databaseHelper";
import { Colors } from 'react-native/Libraries/NewAppScreen';
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
  const [cnt, increment] = useState(0);

  const mapView = () => {
    return (
      <MapView
        initialRegion={{
          latitude: 37.764955,
          longitude: -122.419817,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        }}
        style = {styles.map}
        // showsUserLocation = {true}
        followUserLocation = {false}
        zoomEnabled = {true}
      >
        {originLat && originLong ? pin ("Origin", originLat, originLong, onDragEndOrigin) : null}
        {destLat && destLong ? pin ("Destination", destLat, destLong, onDragEndDest): null}
      </MapView>
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
    const locations = await Location.geocodeAsync(origin);
    if (!locations || locations.length == 0) {
      alert(`Please enter a valid ${name} address.\n`);
    } else {
      const location = locations[0];
      setLatFunc(location.latitude);
      setLongFunc(location.longitude);
      forceUpdate();
    }
  }

  const onDragEndDest = async (e) => {
    const coord = e.nativeEvent.coordinate;
    const addrs = await Location.reverseGeocodeAsync(coord);
    setDestLat(coord.latitude);
    setDestLong(coord.longitude);
    const addr = addrs[0];
    setDest(addr.name + ", " + addr.city + ", " + addr.region + " " + addr.postalCode);
  }

  const onDragEndOrigin = async (e) => {
    const coord = e.nativeEvent.coordinate;
    const addrs = await Location.reverseGeocodeAsync(coord);
    setOriginLat(coord.latitude);
    setOriginLong(coord.longitude);
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

  const requestButton = async (setLat, setLong) => {
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

    setLat(body.origin_lat);
    setLong(body.origin_long);

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
    <View style={styles.body}>
      <Text style={styles.sectionTitle}>Number of Riders</Text>
      <TextInput
        style={styles.textInput}
        keyboardType={'number-pad'}
        onChange={(e) => setNumRiders (e.nativeEvent.text)}
      />
      <Text style={styles.sectionTitle}>Safety Level</Text>
      <Text style={styles.sectionTitle}>Rate 0-9 (0 no problem, 9 emergency)</Text>
      <TextInput
        style={styles.textInput}
        keyboardType={'number-pad'}
        onChange={(e) => setSafetyLevel (e.nativeEvent.text)}
      />
      <Text style={styles.sectionTitle}>Pickup Address</Text>
      <TextInput
        value={origin}
        props={commonProps}
        style={styles.textInput}
        onChange={(e) => setOrigin (e.nativeEvent.text)}
        onEndEditing={() => convertToLatLong("pickup", setOriginLat, setOriginLong)}
      />
      <Text style={styles.sectionTitle}>Dropoff Address</Text>
      <TextInput
        value={dest}
        props={commonProps}
        style={styles.textInput}
        onChange={(e) => setDest (e.nativeEvent.text)}
        onEndEditing={() => convertToLatLong("dropoff", setDestLat, setDestLong)}
      />
      {mapView ()}
      
      <LocationContext.Consumer>
      {({ setLat, setLong }) => {
          return (<Button
            title="Request Ride"
            onPress={() => {
              requestButton(setLat, setLong)}
            }
          />)
        }
      }
      </LocationContext.Consumer>
      <Button
        title="Logout"
        onPress={logoutButton}
      />
    </View>
  );
}
  

const commonProps = {
  autoCapitalize: 'none',
  autoCompleteType: 'off',
  autoCorrect: false,
  spellCheck: false,
}


const styles = StyleSheet.create({
  textInput: { 
    height: 40,
    borderColor: 'gray',
    borderWidth: 1 
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/2.5,
  },
});

export default RequestPage;
