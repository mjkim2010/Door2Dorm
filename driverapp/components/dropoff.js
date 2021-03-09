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

class DropOffPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        student: "Jake Wagner",
        location: "Suites",
      };
      this.droppedOff = this.droppedOff.bind(this);
    }

    droppedOff() {
        this.props.history.push("/pickup");
    }

    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              
                <Text style={styles.sectionTitle}>Drop off {this.state.student} at {this.state.location}</Text>
                <Button
                    onPress={this.droppedOff}
                    title="Successfully Dropped Off"
                    accessibilityLabel="Dropped Off"
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
  
  export default DropOffPage;
  