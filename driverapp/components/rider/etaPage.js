import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { LocationContext } from '../locationContext.js';
import { decode } from "@mapbox/polyline";

const EtaPage = (props) => {
  const { originLat, originLong, destLat, destLong, origin, dest } = props;
  const [queuePosition, setQueuePosition] = useState(4);
  const [timeLeft, setTimeLeft] = useState(17);
  const [coords, setCoords] = useState([]);

  useEffect (() => {
    getDirections()
      .then(coordinates => setCoords (coordinates))
      .catch(err => console.log ("Something went wrong."));
  }, []);

  const leaveQueue = () => props.history.push("/rideRequest");

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

  const getLatLongString = (lat, long) => {
    return lat + "," + long;
  }

  const getMap = (originLat, originLong, destLat, destLong) => {
    let originLatNum = Number(originLat)
    let originLongNum = Number(originLong)
    let destLatNum = Number(destLat)
    let destLongNum = Number(destLong)

    return (
      <>
        <MapView
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
        </MapView>
      </>
    );
  }

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
