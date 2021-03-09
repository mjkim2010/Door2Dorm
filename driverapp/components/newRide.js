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
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              
                <Text style={styles.sectionTitle}>Select Option</Text>
                <Button
                    onPress={this.newRide}
                    title="New Ride"
                    accessibilityLabel="New Ride"
                />
                <Button
                    onPress={this.logout}
                    title="Log Off"
                    accessibilityLabel="Log Off"
                />
            </ScrollView>
          </SafeAreaView>
        </>
      );
    }
  }
  
  const styles = StyleSheet.create({
    sectionTitle: {
      textAlign: 'center',
      marginHorizontal: 32,
      marginVertical: 32,
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
  });
  
  export default NewRidePage;
  