import React, { useEffect } from 'react';
import {
  Text,
  TextInput,
  Button,
  Alert,
  View,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { ReadItem } from "./databaseHelper";
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

class RequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        numRiders: "",
        // TODO: remove currentLoc
        currentLoc: "",
        destination: "",
        safetyLevel: "",

    };
    this.requestButton = this.requestButton.bind(this);
    this.logoutButton = this.logoutButton.bind(this);
  }

  componentDidMount() {
    this.setState({ studentId: this.props.studentInfo.studentId });
  }

  async getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      return await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    } else {
      console.log('Location permission not granted\n');
    }
  }

  logoutButton() {
      this.props.onLogout();
  }

  // async so that we can handle promise from AsyncStorage
  async requestButton() {

    var numPassengers = /^\d{1}$/;
    var safetyNum = /^\d{1}$/;
    let url = 'http://127.0.0.1:8000/rides/placeholder/cr-ride/'; // append slash to match Django expectations

    if (this.state.currentLoc.length < 1) {
        alert("You must enter a current location")
    } else if (this.state.destination.length < 1) {
        alert("You must enter a destination")
    } else if (!this.state.numRiders.match(numPassengers)) {
      alert("Double check your number of riders is a digit less than 5")
    } else if (!this.state.safetyLevel.match(safetyNum)) {
        alert("Double check your safety level is a digit between 1 and 9")
    } else {
      var sunet = await ReadItem("sunet"); // promise, wait for this value

      let curLocation = this.getLocationAsync();

      // TODO: remove current_loc
      let body = {
        // case must match that of backend
        current_loc: this.state.currentLoc,
        destination: this.state.destination,
        num_riders: this.state.numRiders,
        safety_level: this.state.safetyLevel,
        sunet: sunet,
        cur_lat: (await curLocation).coords.latitude,
        cur_long: (await curLocation).coords.longitude,
      };

      // TODO: Once fully connected need to move this.props.onLogin() to the success .then portion so we only move you with a successful request.
      this.props.onRequest(body);
      console.log(body);
      axios.post(url, body)
        .then(function(res) {
          console.log('Response received\n');
          console.log(res.data);
        })
        .catch(function(err) {
          console.log("Error making the call");
          console.log(err);
          if (err.request) {
            console.log(err.request);
          }
        });

    }
  }

  // TODO: Need input validation so the values sent over isn't None
  render() {
    return (
          // TODO: remove 'Current Location'
          <View style={styles.body}>
                <Text style={styles.sectionTitle}>Current Location</Text>
                <TextInput
                      autoCapitalize={'none'}
                      autoCompleteType={'off'}
                      autoCorrect={false}
                      spellCheck={false}
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                      onChange={(e) => {
                          this.setState({ currentLoc: e.nativeEvent.text });
                      }}
                />

                <Text style={styles.sectionTitle}>Destination</Text>
                <TextInput
                      autoCapitalize={'none'}
                      autoCompleteType={'off'}
                      autoCorrect={false}
                      spellCheck={false}
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                      onChange={(e) => {
                          this.setState({ destination: e.nativeEvent.text });
                      }}
                />

                <Text style={styles.sectionTitle}>Number of Riders</Text>
                <TextInput
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                      keyboardType={'number-pad'}
                      onChange={(e) => {
                          this.setState({ numRiders: e.nativeEvent.text });
                      }}
                />

                <Text style={styles.sectionTitle}>Safety Level</Text>
                <Text style={styles.sectionTitle}>Rate 0-9 (0 no problem, 9 emergency)</Text>
                <TextInput
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                      keyboardType={'number-pad'}
                      onChange={(e) => {
                          this.setState({ safetyLevel: e.nativeEvent.text });
                      }}
                />

                <Button
                      title="Request Ride"
                      onPress={this.requestButton}
                />
                <Button
                    title="Logout"
                    onPress={this.logoutButton}
                />
          </View>
    );
  }
}

const styles = StyleSheet.create({
      body: {
        backgroundColor: Colors.white,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
      }
});

export default RequestPage;
