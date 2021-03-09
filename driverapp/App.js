/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text, StatusBar} from 'react-native';
import { registerRootComponent } from 'expo';
import { NativeRouter, Switch, Route, Link } from "react-router-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';

import RegisterPage from './components/register.js';
import LoginPage from './components/login.js'
import HomePage from './components/homepage.js'
import PickUpPage from './components/pickup.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistered: false,
      isLoggedIn: false,
      enteredApp: false
    };
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <NativeRouter>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/pickup" component={PickUpPage} />
            </Switch>
          </NativeRouter>
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

registerRootComponent(App);
export default App;
