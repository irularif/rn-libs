import documentPicker from "../../utils/document-picker";
import { StyleSheet, ViewStyle } from "react-native";
import { IDocumentPicker } from ".";
import mime from "mime-types";

export const generateDocumentPicker = (props: IDocumentPicker) => {
  const { onChange, onChangeValue, onBlur, style, placeholder, value } = props;
  const cstyle: ViewStyle = StyleSheet.flatten([
    {
      flexGrow: 1,
      flexDirection: "column",
      paddingVertical: 15,
      alignItems: "center",
    },
    style,
  ]);
  let label = placeholder || "Press to upload document";
  if (!!value) {
    const uripath = value.split("/");
    const fileName = uripath[uripath.length - 1];
    label = fileName;
  }
  const cprops = {
    type: props?.type,
    copyToCacheDirectory: props?.copyToCacheDirectory,
    multiple: props?.multiple,
  };

  const handlePress = async () => {
    const result = await documentPicker(cprops);

    if (!!result) {
      if (result.type === "success") {
        if (!!onChangeValue) {
          onChangeValue(result.uri);
        }
        if (!!onChange) {
          onChange(result);
        }
      }
      if (!!onBlur) {
        onBlur();
      }
    }
  };

  const clearSource = () => {
    if (!!onChangeValue) {
      onChangeValue("");
    }
    if (!!onChange) {
      onChange(null);
    }
    if (!!onBlur) {
      onBlur();
    }
  };

  return {
    style: cstyle,
    label,
    value,
    handlePress,
    clearSource,
  };
};
