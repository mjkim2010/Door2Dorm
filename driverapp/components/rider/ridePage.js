import React, { useContext } from 'react';
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
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { LocationContext } from '../locationContext.js';

class RequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        numRiders: "",
        currentLoc: "",
        destination: "",
        safetyLevel: "",

    };
    this.requestButton = this.requestButton.bind(this);
    this.logoutButton = this.logoutButton.bind(this);
  }

  componentDidMount() {
    // TODO RETRIEVE STUDENTID FROM URL
    this.setState({ studentId: '06175468' });
  }

  async getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    let perm;
    while (!perm || perm.status !== 'granted')
      {
        perm = await Permissions.askAsync(Permissions.LOCATION);
      }
    return await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
  }

  logoutButton() {
      this.props.history.push('/loginRider');
  }

  // async so that we can handle promise from AsyncStorage
  async requestButton(setLat, setLong) {

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
      if (!curLocation)
        {
          alert("Cannot access your location.\n");
          return;
        }

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
      setLat(body.cur_lat);
      setLong(body.cur_long);
      // TODO: Once fully connected need to move this.props.history.push() to the success .then portion so we only move you with a successful request.
      this.props.history.push('/eta');
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

  render() {
    return (
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

                <LocationContext.Consumer>
                {({ setLat, setLong }) => {
                    return (<Button
                      title="Request Ride"
                      onPress={() => {
                        this.requestButton(setLat, setLong)}
                      }
                    />)
                  }
                }
                </LocationContext.Consumer>
                
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
