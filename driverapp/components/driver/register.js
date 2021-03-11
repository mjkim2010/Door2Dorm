import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    TextInput,
    Text,
    StatusBar,
    Button,
    Image,
    View,
  } from 'react-native';
  
  import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

class RegisterPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        studentID: "",
        password: "",
      };
      this.register = this.register.bind(this);
      this.switchToLogin = this.switchToLogin.bind(this);
    }

    register() {
        this.props.history.push("/newRide")
    }

    switchToLogin() {
        this.props.history.push("/login")
    }

    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <ScrollView>
                <Text style={styles.title}>Register</Text>
                
                <Text style={styles.sectionTitle}>First Name</Text>
                <TextInput
                    style={styles.textInput}
                    onChange={(e) => {
                        this.setState({ firstName: e.nativeEvent.text });
                    }}
                />
                <Text style={styles.sectionTitle}>Last Name</Text>
                <TextInput
                    style={styles.textInput}
                    onChange={(e) => {
                        this.setState({ lastName: e.nativeEvent.text });
                    }}
                />
                <Text style={styles.sectionTitle}>Phone Number</Text>
                <TextInput
                    style={styles.textInput}
                    onChange={(e) => {
                        this.setState({ phoneNumber: e.nativeEvent.text });
                    }}
                />
                <Text style={styles.sectionTitle}>Student ID</Text>
                <TextInput
                    style={styles.textInput}
                    onChange={(e) => {
                        this.setState({ studentID: e.nativeEvent.text });
                    }}
                />
                <Text style={styles.sectionTitle}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    onChange={(e) => {
                        this.setState({ password: e.nativeEvent.text });
                    }}
                />
                <View style={styles.buttonContainer}>
                  <Button
                      style={styles.button}
                      onPress={this.register}
                      title="Register"
                      accessibilityLabel="Register"
                      color='#55D7F5'
                  />
                  <View style={styles.separator} />
                  <Button
                      style={styles.button}
                      onPress={this.switchToLogin}
                      title="Already Have an Account? Login"
                      accessibilityLabel="Login"
                      color='#55D7F5'
                  />
                </View> 
              </ScrollView>
          </SafeAreaView>
        </>
      );
    }
  }
  
  const styles = StyleSheet.create({
    textInput: { 
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        fontWeight: '600',
        color: Colors.black,
        marginVertical: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: Colors.black,
    },
    buttonContainer: {
      alignSelf: 'center',
      justifyContent:"flex-start",
      alignItems: 'center',
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
    },
  });
  
  export default RegisterPage;
  