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
import { DriverContext } from './components/driverContext.js';
import * as Location from 'expo-location';
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
import * as Permissions from 'expo-permissions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.setLocations = (originLat, originLong, destLat, destLong, origin, dest) => {
      this.setState( _ => ({
        originLat: originLat,
        originLong: originLong,
        destLat: destLat,
        destLong: destLong,
        origin: origin,
        dest: dest
      }));
    }

    this.setNumber = (number) => {
      this.setState( _ => ({
        driver_phone_number: number,
      }));
    }

    this.setRideID = (number) => {
      this.setState( _ => ({
        ride_id: number,
      }));
    }
    
    this.state = {
      originLat: "",
      originLong: "",
      destLat: "",
      destLong: "",
      driverLat: "",
      driverLong: "",
      driverLoc: "",
      setLocations: this.setLocations,
      driver_phone_number: "",
      setNumber: this.setNumber,
      ride_id: "",
      setRideID: this.setRideID,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getInitialLocation = this.getInitialLocation.bind(this);
    this.getPermission = this.getPermission.bind(this);
    this.getLocationAsync = this.getLocationAsync.bind(this);
  }

  getLocationAsync = async () => {
    return await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
  }

  getInitialLocation = async () => {
    this.getPermission();
    const location = await this.getLocationAsync();
    if (location) {
      const lat = location.coords.latitude;
      const long = location.coords.longitude;
      const addrs = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: long,
      });
      const addr = addrs[0];
      const addrString = addr.name + ", " + addr.city + ", " + addr.region + " " + addr.postalCode;
      this.setState({driverLat: lat, driverLong: long, driverLoc: addrString});
    }
  }

  getPermission = async() => {
    let perm;
    while (!perm || perm.status !== 'granted')
      {
        perm = await Permissions.askAsync(Permissions.LOCATION);
      }
  }

  componentDidMount () {
    this.getInitialLocation();
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
                  <Route path="/pickup" 
                         render={(props) => (
                          <PickUpPage {...props} 
                            // Currently hardcoded
                            originLat={37.4266347}
                            originLong={-122.1668406}
                            destLat={37.4242442}
                            destLong={-122.1779277}
                            driverLat={37.4254281}
                            driverLong={-122.1628727}
                            origin={"557 Escondido Mall, Stanford, CA 94305"}
                            dest={"589 Governor's Ave, Stanford, CA 94305"}
                            driverLoc={"655 Escondido Rd, Stanford, CA 94305"}
                            student={"Shelly Deng"}
                            phone={6503678867}/>
                       )}/>
                  <Route path="/dropoff" 
                         render={(props) => (
                          <PickUpPage {...props} 
                            // Currently hardcoded
                            destLat={37.4242442}
                            destLong={-122.1779277}
                            driverLat={37.4254281}
                            driverLong={-122.1628727}
                            dest={"589 Governor's Ave, Stanford, CA 94305"}
                            driverLoc={"655 Escondido Rd, Stanford, CA 94305"}
                            student={"Shelly Deng"}
                            phone={6503678867}/>
                       )}/>
                  <Route path="/newRide" component={NewRidePage} />
                  <Route path="/loading" component={LoadingPage} />
                  <Route path="/registerRider" component={RegisterRiderPage} />
                  <Route path="/rideRequest" component={RequestPage} />
                  <Route path="/eta" 
                         render={(props) => (
                            <EtaPage {...props} 
                              originLat={this.state.originLat}
                              originLong={this.state.originLong}
                              destLat={this.state.destLat}
                              destLong={this.state.destLong}
                              origin={this.state.origin}
                              dest={this.state.dest}/>
                         )}
                  />
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
