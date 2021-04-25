import * as DocumentPicker from 'expo-document-picker';
import {Alert} from 'react-native';

export default (
  props?: DocumentPicker.DocumentPickerOptions,
): Promise<DocumentPicker.DocumentResult> => {
  return new Promise((resolve, reject) => {
    try {
      DocumentPicker.getDocumentAsync(props)
        .then(res => {
          if (res.type === 'success') {
            resolve(res);
          } else {
            resolve(res);
          }
        })
        .catch(error => {
          let msg = error.message;
          if (!msg) {
            msg = 'Failed to take a document. Please try again.';
          }
          Alert.alert('Alert', msg);
          reject(msg);
        });
    } catch (error) {
      let msg = error.message;
      if (!msg) {
        msg = 'Failed to take a document. Please try again.';
      }
      Alert.alert('Alert', msg);
      reject(msg);
    }
  });
};
