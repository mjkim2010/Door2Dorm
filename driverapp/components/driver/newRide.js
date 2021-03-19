import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
  } from 'react-native';
  
import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

import { DriverContext } from '../driverContext.js';

/* The Pickup Page renders when the Driver is assigned a ride. */
class NewRidePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.newRide = this.newRide.bind(this);
      this.logout = this.logout.bind(this);
    }

    /* When the driver accepts a ride, he/she/they are navigated to the PickupPage*/
    newRide(driver_phone_number, ride_id) {
      this.props.history.push("/pickup");
    }

    /* If they press "Log Out", we navigate them to the Driver LoginPage. */
    logout() {
      this.props.history.push("/login");
    }


    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>You have been assigned a ride!</Text>
                <View style={styles.buttonContainer}>
                  <DriverContext.Consumer>
                    {({ driver_phone_number, ride_id }) => {
                      return (
                        <TouchableOpacity 
                          onPress={() => {
                            this.newRide(driver_phone_number, ride_id);
                              }
                            } 
                          style={styles.button}>
                          <Text>Accept</Text>
                        </TouchableOpacity>
                      )
                    }}
                  </DriverContext.Consumer>
                  <TouchableOpacity onPress={this.logout} style={styles.button}>
                      <Text> Log Out </Text>
                  </TouchableOpacity>
                </View>
            </View>
          </SafeAreaView>
        </>
      );
    }
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
    },
  });
  
  export default NewRidePage;