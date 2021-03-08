import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    TextInput,
    Text,
    StatusBar,
    Button,
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
        this.props.Register()
    }

    switchToLogin() {
        this.props.SwitchToLogin()
    }

    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              
                <Text style={styles.sectionTitle}>Register</Text>
                <Text style={styles.sectionTitle}>First Name</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChange={(e) => {
                        this.setState({ firstName: e.nativeEvent.text });
                    }}
                />
                <Text style={styles.sectionTitle}>Last Name</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChange={(e) => {
                        this.setState({ lastName: e.nativeEvent.text });
                    }}
                />
                <Text style={styles.sectionTitle}>Phone Number</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChange={(e) => {
                        this.setState({ phoneNumber: e.nativeEvent.text });
                    }}
                />
                <Text style={styles.sectionTitle}>Student ID</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChange={(e) => {
                        this.setState({ studentID: e.nativeEvent.text });
                    }}
                />
                <Text style={styles.sectionTitle}>Password</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChange={(e) => {
                        this.setState({ password: e.nativeEvent.text });
                    }}
                />
                <Button
                    onPress={this.register}
                    title="Register"
                    accessibilityLabel="Register"
                />
                <Button
                    onPress={this.switchToLogin}
                    title="Already Have an Account? Login"
                    accessibilityLabel="Login"
                />
            </ScrollView>
          </SafeAreaView>
        </>
      );
    }
  }
  
  const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    body: {
      backgroundColor: Colors.white,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });
  
  export default RegisterPage;
  