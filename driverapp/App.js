/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StatusBar} from 'react-native';
import { registerRootComponent } from 'expo';
import { NativeRouter, Switch, Route } from "react-router-native";
import { LocationContext } from './components/locationContext.js';

import RegisterDriverPage from './components/driver/register.js';
import LoginDriverPage from './components/driver/login.js';
import HomePage from './components/home.js';
import PickUpPage from './components/driver/pickup.js';
import DropOffPage from './components/driver/dropoff.js';
import NewRidePage from './components/driver/newRide.js';
import LoadingPage from './components/driver/loading.js';
import LoginRiderPage from './components/rider/login.js';
import RegisterRiderPage from './components/rider/registerRider';
import RequestPage from './components/rider/ridePage';
import EtaPage from './components/rider/etaPage';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.setLat = (lat) => {
      this.setState( _ => ({
        cur_lat: lat,
      }));
    };

    this.setLong = (long) => {
      this.setState( _ => ({
        cur_long: long,
      }));
    };

    this.state = {
      cur_lat: "",
      setLat: this.setLat,
      cur_long: "",
      setLong: this.setLong
    };

  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <LocationContext.Provider value={this.state}>
              <NativeRouter>
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Route path="/register" component={RegisterDriverPage} />
                  <Route path="/login" component={LoginDriverPage} />
                  <Route path="/pickup" component={PickUpPage} />
                  <Route path="/dropoff" component={DropOffPage} />
                  <Route path="/newRide" component={NewRidePage} />
                  <Route path="/loading" component={LoadingPage} />
                  <Route path="/registerRider" component={RegisterRiderPage} />
                  <Route path="/rideRequest" component={RequestPage} />
                  <Route path="/eta" component={EtaPage} />
                  <Route path="/loginRider" component={LoginRiderPage} />
                </Switch>
              </NativeRouter>
            </LocationContext.Provider>
        </SafeAreaView>
      </>
    );
  }
}

registerRootComponent(App);
export default App;