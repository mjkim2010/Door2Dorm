import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
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
        this.props.history.push("/newRide");
    }

    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <Text style={styles.title}>Login</Text>
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
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    textInput: { 
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        marginBottom: 24,
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
  