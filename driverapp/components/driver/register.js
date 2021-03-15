import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Text,
    StatusBar,
    Button,
    Image,
    View,
  } from 'react-native';
import axios from 'axios';
import { DriverContext } from '../driverContext';

class RegisterPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        ID: "",
        password: "",
        emailAddress: "",
        driverLicense: "",
      };
      this.sendPostRequest = this.sendPostRequest.bind(this);
      this.register = this.register.bind(this);
      this.switchToLogin = this.switchToLogin.bind(this);
    }

    sendPostRequest(setNumber) {
    // JSON file that will be sent to the POST endpoint
      let payload = {
        "first": this.state.firstName,
        "last": this.state.lastName,
        "email": this.state.emailAddress,
        "password": this.state.password,
        "phone": this.state.phoneNumber,
        "license": this.state.driverLicense
      }
      setNumber(this.state.phoneNumber);
      const url = 'http://127.0.0.1:8000/drivers/placeholder/cr-driver/';
      //const url = 'http://ec2-3-138-107-41.us-east-2.compute.amazonaws.com:8000/drivers/placeholder/cr-driver/';
      var self = this;
      axios.post(url, payload)
        .then(function(res) {
          console.log('Response received\n');
          console.log(res.data);
          self.props.history.push("/loading");
        })
        .catch(function(err) {
          console.log("Error making the call");
          console.log(err);
          if (err.request) {
            console.log(err.request);
          }
        });
    }

    register(setNumber) {
        this.sendPostRequest(setNumber);
    }

    switchToLogin() {
        this.props.history.push("/login")
    }

    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
          <View style={styles.container}>
              <Image
                style={styles.logo}
                source={require('../../img/Door2Dorm2.png')}
              />
              <View style={styles.inputView}>
                <TextInput
                  autoCompleteType={'off'}
                  autoCorrect={false}
                  spellCheck={false}
                  style={styles.textInput}
                  placeholder="First Name"
                  placeholderTextColor="#a3aaad"
                  onChange={(e) => {
                    this.setState({ firstName: e.nativeEvent.text });
                  }}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  autoCompleteType={'off'}
                  autoCorrect={false}
                  spellCheck={false}
                  style={styles.textInput}
                  placeholder="Last Name"
                  placeholderTextColor="#a3aaad"
                  onChange={(e) => {
                    this.setState({ lastName: e.nativeEvent.text });
                  }}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  autoCompleteType={'off'}
                  autoCorrect={false}
                  spellCheck={false}
                  style={styles.textInput}
                  placeholder="Phone Number"
                  placeholderTextColor="#a3aaad"
                  onChange={(e) => {
                    this.setState({ phoneNumber: e.nativeEvent.text });
                  }}
                />
              </View>
            <View style={styles.inputView}>
                <TextInput
                  autoCapitalize={'none'}
                  autoCompleteType={'off'}
                  autoCorrect={false}
                  spellCheck={false}
                  style={styles.textInput}
                  placeholder="Driver license"
                  placeholderTextColor="#a3aaad"
                  onChange={(e) => {
                    this.setState({ driverLicense: e.nativeEvent.text });
                  }}
                />
            </View>
              <View style={styles.inputView}>
                <TextInput
                  autoCapitalize={'none'}
                  autoCompleteType={'off'}
                  autoCorrect={false}
                  spellCheck={false}
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="#a3aaad"
                  onChange={(e) => {
                    this.setState({ emailAddress: e.nativeEvent.text });
                  }}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  autoCompleteType={'off'}
                  autoCorrect={false}
                  spellCheck={false}
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#a3aaad"
                  secureTextEntry={true}
                  onChange={(e) => {
                    this.setState({ password : e.nativeEvent.text });
                  }}
                />
              </View>
              <DriverContext.Consumer>
                {({ setNumber }) => {
                  return (
                    <TouchableOpacity 
                      onPress={() => {
                          this.register(setNumber);
                          }
                        } 
                      style={styles.registerBtn}>
                      <Text>Register</Text>
                    </TouchableOpacity>
                  )
                }}
              </DriverContext.Consumer>
              <Button
                  onPress={this.switchToLogin}
                  title="Already Have an Account? Sign In"
                  accessibilityLabel="Login"
                  color='black'
              />
              </View> 
          </SafeAreaView>
        </>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
     },
    back: {
      alignItems: "flex-start",
    },
    logo: {
      width: 170,
      height: 170,
      marginBottom: 10,
      marginTop: 20,
    },
    inputView: {
      backgroundColor: "#eceeee",
      borderRadius: 30,
      width: 350,
      height: 45,
      marginBottom: 15,
      alignItems: "center",
    },
    textInput: {
      height: 50,
      flex: 1,
      padding: 10,
    },
    registerBtn: {
      width: 150,
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      backgroundColor: "#55D7F5",
    },
    forgot_button: {
      height: 30,
      marginBottom: 20,
    },
  });
  
  export default RegisterPage;