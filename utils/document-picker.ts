import * as DocumentPicker from "expo-document-picker";

export default (
  props?: DocumentPicker.DocumentPickerOptions
): Promise<DocumentPicker.DocumentResult> => {
  return new Promise((resolve, reject) => {
    try {
      DocumentPicker.getDocumentAsync(props)
        .then((res) => {
          if (res.type === "success") {
            resolve(res);
          } else {
            resolve(res);
          }
        })
        .catch((error) => {
          let msg = error.message;
          if (!msg) {
            msg = "Failed to take a document. Please try again.";
          }
          alert(msg);
          reject(msg);
        });
    } catch (error) {
      let msg = error.message;
      if (!msg) {
        msg = "Failed to take a document. Please try again.";
      }
      alert(msg);
      reject(msg);
    }
  });
};
