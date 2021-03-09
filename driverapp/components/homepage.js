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
    Image,
    Dimensions,
  } from 'react-native';
  import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

class HomePage extends React.Component {
    constructor(props) {
      super(props);
        this.state = {

      };
      this.enterApp = this.enterApp.bind(this);
    }

    enterApp() {
      this.props.history.push("/register")
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
              title="I'm a Driver"
              onPress={this.enterApp}
              accessibilityLabel="I'm a Driver"
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
      flex:1,
      paddingTop: 600
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
  