import React from 'react';
import {
  Text,
  TextInput,
  Button,
  Alert,
  View,
  StyleSheet,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const RequestPage = () => {
      const [value, onChangeText] = React.useState();
      return (
            <View style={styles.body}>
                  <Text style={styles.sectionTitle}>Name</Text>
                  <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={text => onChangeText(text)}
                        value={value}
                  />
                  <Text style={styles.sectionTitle}>Sunet ID (Number)</Text>
                  <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                  />
                  <Text style={styles.sectionTitle}>Number of Riders</Text>
                  <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                  />
                  <Text style={styles.sectionTitle}>Phone Number</Text>
                  <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                  />
                  <Text style={styles.sectionTitle}>Current Location</Text>
                  <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                  />
                  <Text style={styles.sectionTitle}>Destination</Text>
                  <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                  />
                  <Button
                        title="Submit"
                        onPress={() => Alert.alert('Request Sent')}
                  />
            </View>
      );
}

const styles = StyleSheet.create({
      body: {
        backgroundColor: Colors.white,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
      }
});

export default RequestPage;