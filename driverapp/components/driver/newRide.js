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

class NewRidePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.newRide = this.newRide.bind(this);
      this.logout = this.logout.bind(this);
    }

    newRide() {
      this.props.history.push("/loading")
    }

    logout() {
      this.props.history.push("/")
    }


    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Select Option</Text>
                <View style={styles.buttonContainer}> 
                  <Button
                      onPress={this.newRide}
                      title="New Ride"
                      accessibilityLabel="New Ride"
                      color='#55D7F5'
                  />
                  <View style={styles.separator} />
                  <Button
                      onPress={this.logout}
                      title="Log Off"
                      accessibilityLabel="Log Off"
                      color='#55D7F5'
                  />
                </View>
            </View>
          </SafeAreaView>
        </>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: '100%'
    },
    sectionTitle: {
      textAlign: 'center',
      marginHorizontal: 32,
      marginVertical: 32,
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
    },
    buttonContainer: {
      alignSelf: 'center',
      justifyContent:"flex-start",
      alignItems: 'center',
    },
  });
  
  export default NewRidePage;
  