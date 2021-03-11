/*
 * Helper for reading and writing data from AsyncStorage. Taken from
 * https://stackoverflow.com/questions/62554585/saving-data-into-async-storage-onpress-in-react-native
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SaveItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(value);
  } catch (e) {
    console.log(e);
  }
};

export const ReadItem = async (key) => {
  try {
    var result = await AsyncStorage.getItem(key);
    console.log(result);
    return result;
  } catch (e) {
    return e;
  }
};

