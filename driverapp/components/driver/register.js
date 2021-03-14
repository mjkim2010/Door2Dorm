// import React, { useState } from 'react';

// import {
//     SafeAreaView,
//     StyleSheet,
//     TouchableOpacity,
//     TextInput,
//     Text,
//     StatusBar,
//     Button,
//     Image,
//     View,
//     KeyboardAvoidingView,
//   } from 'react-native';


// const RegisterPage = (props) => {
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [email, setEmail] = useState("");
//     const [driverLicense, setDriverLicense] = useState("");

//     const register = () => {
//         props.history.push("/newRide");
//     }

//     const switchToLogin = () => {
//         props.history.push("/login");
//     }

//       return (
//         <>
//           <SafeAreaView style={{flex:1, justifyContent: 'center'}}>
//             <View style={styles.container}>
//                 <Image
//                   style={styles.logo}
//                   source={require('../../img/Door2Dorm2.png')}
//                 />
//                 <View style={styles.body}>
//                   <View style={styles.inputView}>
//                     <TextInput
//                       props={commonProps}
//                       style={styles.textInput}
//                       value={firstName}
//                       placeholder="First Name"
//                       placeholderTextColor="#a3aaad"
//                       onChange={(e) => setFirstName (e.nativeEvent.text)}
//                     />
//                   </View>
//                   <View style={styles.inputView}>
//                     <TextInput
//                       props={commonProps}
//                       style={styles.textInput}
//                       value={lastName}
//                       placeholder="Last Name"
//                       placeholderTextColor="#a3aaad"
//                       onChange={(e) => setLastName (e.nativeEvent.text)}
//                     />
//                   </View>
//                   <View style={styles.inputView}>
//                     <TextInput
//                       autoCapitalize={'none'}
//                       props={commonProps}
//                       style={styles.textInput}
//                       value={email}
//                       placeholder="Email"
//                       placeholderTextColor="#a3aaad"
//                       onChange={(e) => setEmail (e.nativeEvent.text)}
//                     />
//                   </View>
//                   <View style={styles.inputView}>
//                     <TextInput
//                       keyboardType={'number-pad'}
//                       style={styles.textInput}
//                       value={phone}
//                       placeholder="Phone Number"
//                       placeholderTextColor="#a3aaad"
//                       onChange={(e) => setPhone (e.nativeEvent.text)}
//                     />
//                   </View>
//                   <View style={styles.inputView}>
//                     <TextInput
//                       autoCapitalize={'none'}
//                       props={commonProps}
//                       style={styles.textInput}
//                       value={driverLicense}
//                       placeholder="Driver license"
//                       placeholderTextColor="#a3aaad"
//                       onChange={(e) => setDriverLicense (e.nativeEvent.text)}
//                     />
//                 </View>
//                   <View style={styles.inputView}>
//                     <TextInput
//                       autoCapitalize={'none'}
//                       props={commonProps}
//                       style={styles.textInput}
//                       value={username}
//                       placeholder="Username"
//                       placeholderTextColor="#a3aaad"
//                       onChange={(e) => setUsername (e.nativeEvent.text)}
//                     />
//                   </View>
//                   <View style={styles.inputView}>
//                     <TextInput
//                       autoCapitalize={'none'}
//                       props={commonProps}
//                       style={styles.textInput}
//                       value={password}
//                       placeholder="Password"
//                       placeholderTextColor="#a3aaad"
//                       secureTextEntry={true}
//                       onChange={(e) => setPassword (e.nativeEvent.text)}
//                     />
//                   </View>              
//                   <View style={styles.buttonContainer}>
//                     <TouchableOpacity onPress={register} style={styles.registerBtn}>
//                         <Text style={{alignSelf: 'center'}}>Register</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={switchToLogin} style={styles.forgot_button}>
//                         <Text style={{alignSelf: 'center'}}>Already Have an Account? Sign In</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//             </View>
//           </SafeAreaView>
//         </>
//       );
//   }

//   const commonProps = {
//     autoCompleteType: 'off',
//     autoCorrect: false,
//     spellCheck: false,
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       alignItems: 'center',
//       flex: 1,
//      },
//      body: {

//      },
//     back: {
//       alignItems: "flex-start",
//     },
//     logo: {
//       width: 170,
//       height: 170,
//       marginBottom: 40,
//       marginTop: 20,
//       alignSelf: "center",
//     },
//     inputView: {
//       backgroundColor: "#eceeee",
//       borderRadius: 30,
//       width: 350,
//       height: 45,
//       marginBottom: 20,
//       alignItems: "center",
//     },
//     textInput: {
//       height: 50,
//       flex: 1,
//       padding: 10,
//     },
//     buttonContainer: {
//     },
//     registerBtn: {
//       width: 150,
//       borderRadius: 25,
//       height: 50,
//       alignSelf: "center",
//       justifyContent: "center",
//       marginTop: 20,
//       backgroundColor: "#55D7F5",
//     },
//     forgot_button: {
//       marginTop: 10,
//       height: 30,
//       marginBottom: 10,
//       alignSelf: 'center',
//     },
//   });
  
//   export default RegisterPage;

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

    sendPostRequest() {
    // JSON file that will be sent to the POST endpoint
    let payload = {
      "first": this.state.firstName,
      "last": this.state.lastName,
      "email": this.state.emailAddress,
      "password": this.state.password,
      "phone": this.state.phoneNumber,
      "license": this.state.driverLicense
    }
    const url = 'http://127.0.0.1:8000/drivers/placeholder/cr-driver/';
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

    register() {
        this.sendPostRequest();
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
              <TouchableOpacity onPress={this.register} style={styles.registerBtn}>
                  <Text>Register</Text>
              </TouchableOpacity>
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