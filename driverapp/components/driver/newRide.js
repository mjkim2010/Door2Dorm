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

class NewRidePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.newRide = this.newRide.bind(this);
      this.logout = this.logout.bind(this);
    }

    newRide(driver_phone_number, ride_id) {
      console.log("drive_phone_number: ", driver_phone_number);
      console.log("ride_id: ", ride_id);
      this.props.history.push("/loading");
    }

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