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

