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
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              
                <Text style={styles.sectionTitle}>Pick up {this.state.student} at {this.state.location}</Text>
                <Button
                    onPress={this.pickedUp}
                    title="Successfully Picked Up"
                    accessibilityLabel="Pick Up"
                />
                <Button
                    onPress={this.call}
                    title="Call"
                    accessibilityLabel="Call"
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
  
  export default PickUpPage;
  