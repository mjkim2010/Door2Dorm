/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import RegisterPage from './components/register.js';
import LoginPage from './components/login.js'
import HomePage from './components/homepage.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistered: false,
      isLoggedIn: false,
      enteredApp: false
    };
    this.enterAppFunction = this.enterAppFunction.bind(this);
    this.loginFunction = this.loginFunction.bind(this);
    this.switchToRegisterFunction = this.switchToRegisterFunction.bind(this);
    this.registerFunction = this.registerFunction.bind(this);
    this.switchToLoginFunction = this.switchToLoginFunction.bind(this);
  }

  enterAppFunction() {
    this.setState({
      enteredApp: true,
    });
  }

  loginFunction() {
    this.setState({
      isRegistered: true,
      isLoggedIn: true,
    });
  }

  switchToRegisterFunction() {
    this.setState({
      isRegistered: false,
      isLoggedIn: false,
    });
  }

  registerFunction() {
    this.setState({
      isRegistered: true,
      isLoggedIn: true,
    });
  }

  switchToLoginFunction() {
    this.setState({
      isRegistered: true,
      isLoggedIn: false,
    });
  }


  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          {
            !this.state.enteredApp ?
                <HomePage EnterApp={this.enterAppFunction} />     
            :
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>
                {
                    this.state.isRegistered && this.state.isLoggedIn ?
                      <Text style={styles.sectionTitle}>You are a verified driver</Text>
                    :
                      this.state.isRegistered ?
                        <LoginPage Login={this.loginFunction} SwitchToRegister={this.switchToRegisterFunction} />
                      :
                        <RegisterPage Register={this.registerFunction} SwitchToLogin={this.switchToLoginFunction} />
                }
              </ScrollView>
          }
          
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

export default App;
