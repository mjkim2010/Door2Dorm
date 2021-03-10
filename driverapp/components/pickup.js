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
    Alert,
  } from 'react-native';
  
  import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

class PickUpPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        student: "Jake Wagner",
        location: "Florence Moore Hall",
      };
      this.pickedUp = this.pickedUp.bind(this);
      this.call = this.call.bind(this);
    }

    pickedUp() {
        this.props.history.push("/dropoff");
    }

    call() {
        alert("Calling Student");
    }

    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <View style={styles.container}>
              
                <Text style={styles.sectionTitle}>Pick up {this.state.student} at {this.state.location}</Text>
                <View style={styles.buttonContainer}> 
                  <Button
                      onPress={this.pickedUp}
                      title="Successfully Picked Up"
                      accessibilityLabel="Pick Up"
                      color='#55D7F5'
                  />
                  <View style={styles.separator} />
                  <Button
                      onPress={this.call}
                      title="Call"
                      accessibilityLabel="Call"
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
    buttonContainer: {
      alignSelf: 'center',
      justifyContent:"flex-start",
      alignItems: 'center',
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
    },
  });
  
  export default PickUpPage;
  