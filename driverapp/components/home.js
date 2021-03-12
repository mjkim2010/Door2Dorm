import React from 'react';

import { StyleSheet, View, Button, Text, Image, Dimensions } from 'react-native';

class HomePage extends React.Component {
    constructor(props) {
      super(props);
        this.state = {

      };
      this.driverEnters = this.driverEnters.bind(this);
      this.riderEnters = this.riderEnters.bind(this);
    }

    driverEnters() {
      this.props.history.push("/login")
    }

    riderEnters() {
      this.props.history.push("/loginRider")
    }

    render() {
      return (
        <View style={styles.container}>
          <View style={styles.body}>
            <Text style={styles.logoText}> Door2Dorm </Text>
            <Image
              style={styles.logo}
              source={require('../img/Door2Dorm2.png')}
            />
            <Button
              color='#55D7F5'
              title="I'm a Driver"
              onPress={this.driverEnters}
              accessibilityLabel="I'm a Driver"
            />
            <Button
              color='#55D7F5'
              title="I'm a Rider"
              onPress={this.riderEnters}
              accessibilityLabel="I'm a Rider"
            />
          </View>
        </View>
      );
    }
  }

  const { height, width } = Dimensions.get('window');
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      alignItems:'center',
      justifyContent:'center',
      height: '100%'
    },
    body: {
      alignSelf: 'center',
      justifyContent:"flex-start",
      alignItems: 'center',
      position:"absolute",
    },
    logoText: {
        color: 'black',
        justifyContent:'center',
        fontSize: 50
    },
    logo: {
      width: 200,
      height: 200,
    },
  });
  
  export default HomePage;
  