import * as ImagePicker from 'expo-image-picker';
import {Alert} from 'react-native';

export default (
  props?: ImagePicker.ImagePickerOptions,
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    try {
      ImagePicker.launchImageLibraryAsync(
        Object.assign(
          {
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.6,
          },
          props,
        ),
      )
        .then(res => {
          if (res.cancelled === false) {
            resolve(res.uri);
          } else {
            resolve(null);
          }
        })
        .catch(error => {
          let msg = error.message;
          if (!msg) {
            msg = 'Failed to take a picture. Please try again.';
          }
          Alert.alert('Alert', msg);
          reject(null);
        });
    } catch (error) {
      let msg = error.message;
      if (!msg) {
        msg = 'Failed to take a picture. Please try again.';
      }
      Alert.alert('Alert', msg);
      reject(null);
    }
  });
};
