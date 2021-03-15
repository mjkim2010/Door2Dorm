import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { SaveItem } from "./databaseHelper";


const RegisterPage = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sunet, setSunet] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const switchToLogin = () => {
    props.history.push("/loginRider")
  }

  const verify = () => {
    var phoneno = /^\d{10}$/;
    
    if (firstName.length < 1 || !/^[a-zA-Z]+$/.test(firstName)) {
      alert("You must enter a first name");
    } else if (lastName.length < 1 || !/^[a-zA-Z]+$/.test(lastName)) {
      alert("You must enter a last name");
    } else if (sunet.length > 8 || !/^[a-zA-Z]+$/.test(sunet)) {
      // Todo: Send validation to Stanford DB that this is a real sunet ID
      alert("Double check your Sunet contains less than 9 characters");
    } else if (!phone.match(phoneno)) {
      alert("Double check your phone number is valid, numbers only please!");
    }

    SaveItem('sunet', sunet);
  }

  const sendPostRequest = () => {
    // JSON file that will be sent to the POST endpoint
    let payload = {
      "first": firstName,
      "last": lastName,
      "sunet": sunet,
      "password": password,
      "phone": phone,
    }
    const url = 'http://127.0.0.1:8000/students/placeholder/cr-student/';
    //const url = 'http://ec2-3-138-107-41.us-east-2.compute.amazonaws.com:8000/students/placeholder/cr-student/';
    axios.post(url, payload)
      .then(function(res) {
        console.log('Response received\n');
        console.log(res.data);
        props.history.push("/rideRequest");
      })
      .catch(function(err) {
        console.log("Error making the call");
        console.log(err);
        if (err.request) {
          console.log(err.request);
        }
      });
  }

  const register = () => {
    verify();
    sendPostRequest();
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
          <Image
              style={styles.logo}
              source={require('../../img/Door2Dorm2.png')}
          />
          <View style={styles.inputView}>
              <TextInput
                props={commonProps}
                value={firstName}
                style={styles.textInput}
                placeholder="First Name"
                placeholderTextColor="#a3aaad"
                onChange={(e) => setFirstName (e.nativeEvent.text)}
              />
          </View>
          <View style={styles.inputView}>
              <TextInput
                props={commonProps}
                value={lastName}
                style={styles.textInput}
                placeholder="Last Name"
                placeholderTextColor="#a3aaad"
                onChange={(e) => setLastName (e.nativeEvent.text)}
              />
          </View>
          <View style={styles.inputView}>
              <TextInput
                autoCapitalize={'none'}
                props={commonProps}
                value={sunet}
                style={styles.textInput}
                placeholder="Sunet ID"
                placeholderTextColor="#a3aaad"
                onChange={(e) => setSunet (e.nativeEvent.text)}
              />
          </View>
          <View style={styles.inputView}>
              <TextInput
                autoCapitalize={'none'}
                props={commonProps}
                value={phone}
                style={styles.textInput}
                placeholder="Phone Number"
                keyboardType={'phone-pad'}
                placeholderTextColor="#a3aaad"
                onChange={(e) => setPhone (e.nativeEvent.text)}
              />
          </View>
          <View style={styles.inputView}>
              <TextInput
                autoCapitalize={'none'}
                props={commonProps}
                value={password}
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#a3aaad"
                secureTextEntry={true}
                onChange={(e) => setPassword (e.nativeEvent.text)}
              />
          </View>
          <TouchableOpacity onPress={register} style={styles.registerBtn}>
              <Text>Register</Text>
          </TouchableOpacity>
          <Button
              style={styles.button}
              onPress={switchToLogin}
              title="Already Have an Account? Sign In"
              accessibilityLabel="Sign In"
              color='black'
            />
        </View>
    </SafeAreaView>
  );
}

const commonProps = {
  autoCompleteType: 'off',
  autoCorrect: false,
  spellCheck: false,
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
    marginBottom: 40,
    marginTop: 30,
  },
  inputView: {
    backgroundColor: "#eceeee",
    borderRadius: 30,
    width: 350,
    height: 45,
    marginBottom: 20,
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
    marginTop: 40,
    backgroundColor: "#55D7F5",
  },
  forgot_button: {
    height: 30,
    marginBottom: 10,
  },
});

export default RegisterPage;
