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
import LoginPage from './components/login.js';
import HomePage from './components/home.js';
import PickUpPage from './components/pickup.js';
import DropOffPage from './components/dropoff.js';
import NewRidePage from './components/newRide.js';
import LoadingPage from './components/loading.js';

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
              <Route path="/dropoff" component={DropOffPage} />
              <Route path="/newRide" component={NewRidePage} />
              <Route path="/loading" component={LoadingPage} />
            </Switch>
          </NativeRouter>
        </SafeAreaView>
      </>
    );
  }
}

registerRootComponent(App);
export default App;
