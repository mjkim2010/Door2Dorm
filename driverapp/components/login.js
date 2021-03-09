import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    TextInput,
    Button,
    Text,
    StatusBar,
  } from 'react-native';
  
  import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        studentID: "",
        password: "",
      };
      this.switchToRegister = this.switchToRegister.bind(this);
      this.login = this.login.bind(this);
    }

    switchToRegister() {
        this.props.history.push("/register");
    }

    login() {
        this.props.history.push("/pickup");
    }

    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <Text style={styles.title}>Login</Text>
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
                    this.setState({ password : e.nativeEvent.text });
                }}
            />
            <Button
                onPress={this.login}
                title="Login"
                accessibilityLabel="Login"
            />
            <Button
                onPress={this.switchToRegister}
                title="Don't Have an Account? Register"
                accessibilityLabel="Register"
            />
          </SafeAreaView>
        </>
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
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        fontWeight: '600',
        color: Colors.black,
        marginVertical: 32,
    },
  });
  
  export default LoginPage;
  