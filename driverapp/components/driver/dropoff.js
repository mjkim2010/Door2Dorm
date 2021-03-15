import React, { useEffect, useState } from 'react';
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
  import { LocationContext } from '../locationContext.js';
  import { DriverContext } from '../driverContext.js';
  import MapView, { Polyline } from 'react-native-maps';
  import { Colors } from 'react-native/Libraries/NewAppScreen';
  import { decode } from "@mapbox/polyline";


const DropOffPage = (props) => {
  let { destLat, destLong, dest, student, driverLat, driverLong, driverLoc } = props;
  const [coords, setCoords] = useState([]);
  const context = DriverContext;

  const findRouteCoords = async () => {
    let allCoords = [];
    getDirections(driverLat, driverLong, destLat, destLong)
      .then(coordinates => {
        allCoords.push(...coordinates);
        setCoords(allCoords);
      })
      .catch(err => console.log ("Getting dir from driver to dest fails \n", err));
  }

  useEffect(()=> {
    console.log("38", this.state.driverLat, this.state.driverLong, this.state.originLat, this.state.originLong, this.state.destLat, this.state.destLong);
    findRouteCoords();
  }, []);

  const defaultDelta = 0.0122;
  const defaultDeltaMultiplier= 3;

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

  const mapView = () => {
    console.log("59", this.state.driverLat, this.state.driverLong, this.state.originLat, this.state.originLong, this.state.destLat, this.state.destLong);
    const edge = defaultDelta * defaultDeltaMultiplier;
    if (driverLat == "" || driverLong == "" || driverLoc == "") {
      return null;
    }
    return (
      <View>
        <MapView
          region={{
            latitude: (driverLat + destLat) / 2,
            longitude: (driverLong + destLong) / 2,
            latitudeDelta: Math.abs(driverLat - destLat) + edge,
            longitudeDelta: Math.abs(driverLong - destLong) + edge,
          }}
          style = {styles.map}
          showsUserLocation = {true}
          followUserLocation = {false}
          zoomEnabled = {true}
        >
          {coords.length > 0 && <Polyline coordinates={coords} />}
          {pin ("Dropoff Location", destLat, destLong, 'green')}
          {pin ("Current Location", driverLat, driverLong, 'blue')}
        </MapView>
      </View>
    );
  }

  const getLatLongString = (lat, long) => {
    return lat + "," + long;
  }

  const droppedOff = () => {
    var ride_id = this.context.ride_id;
    sendPostRequest(ride_id);
  }

  const sendPostRequest = (ride_id) => {
    // JSON file that will be sent to the POST endpoint
    let payload = {
      "ride_id": ride_id,
    }
    const url = 'http://127.0.0.1:8000/drivers/placeholder/dropped-off/';
    var self = this;
    axios.post(url, payload)
      .then(function(res) {
        console.log('Response received\n');
        console.log(res.data);
        props.history.push("/newRide");
      })
      .catch(function(err) {
        console.log("Error making the call");
        console.log(err);
        if (err.request) {
          console.log(err.request);
        }
      });
  }

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
              Linking.openURL(`maps://app?saddr=${driverLat}+${driverLong}&daddr=${destLat}+${destLong}`);
              props.history.push("/dropoff");
            }}
            style={styles.button}>
            <Text> Open in Maps </Text>
          </TouchableOpacity> :
          <TouchableOpacity 
            onPress={() => {
              Linking.openURL(`google.navigation:q=${destLat}+${destLong}`);
              props.history.push("/dropoff");
            }}
            style={styles.button}>
              <Text> Open in Maps </Text>
          </TouchableOpacity>
      );
  }

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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Drop off {student} at {dest}</Text>
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
  
  // DropOffPage.contextType = DriverContext;

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