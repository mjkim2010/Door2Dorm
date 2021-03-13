import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { SaveItem } from "./databaseHelper";
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


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
    <View style={styles.body}>
    <Text style={styles.sectionTitle}>First Name</Text>
    <TextInput
      value={firstName}
      props={commonProps}
      style={styles.textInput}
      onChange={(e) => setFirstName (e.nativeEvent.text)}
    />
    <Text style={styles.sectionTitle}>Last Name</Text>
    <TextInput
      value={lastName}
      props={commonProps}
      style={styles.textInput}
      onChange={(e) => setLastName (e.nativeEvent.text)}
    />

    <Text style={styles.sectionTitle}>Sunet (No @stanford.edu)</Text>
    <TextInput
      value={sunet}
      autoCapitalize={'none'}
      props={commonProps}
      style={styles.textInput}
      onChange={(e) => setSunet (e.nativeEvent.text)}
    />
    <Text style={styles.sectionTitle}>Password</Text>
    <TextInput
      value={password}
      style={styles.textInput}
      autoCapitalize={'none'}
      props={commonProps}
      secureTextEntry={true}
      onChange={(e) => setPassword (e.nativeEvent.text)}
    />
    <Text style={styles.sectionTitle}>Phone Number (Numbers only please)</Text>
    <TextInput
      value={phone}
      style={styles.textInput}
      keyboardType={'phone-pad'}
      onChange={(e) => setPhone (e.nativeEvent.text)}
    />
    <Button
      onPress={register}
      title="Register"
      accessibilityLabel="Register"
      color='#55D7F5'
    />
    <Button
      style={styles.button}
      onPress={switchToLogin}
      title="Already Have an Account? Login"
      accessibilityLabel="Login"
      color='#55D7F5'
    />
    </View>
  );
}

const commonProps = {
  autoCompleteType: 'off',
  autoCorrect: false,
  spellCheck: false,
}

const styles = StyleSheet.create({
  textInput: { 
    height: 40,
    borderColor: 'gray',
    borderWidth: 1 
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  }
});

export default RegisterPage;
