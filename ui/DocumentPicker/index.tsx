import { useTheme } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { observer } from "mobx-react";
import React from "react";
import { ViewStyle } from "react-native";
import { ITheme } from "../../config/theme";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";
import { generateDocumentPicker } from "./generator";

export interface IDocumentPicker extends DocumentPicker.DocumentPickerOptions {
  value?: string;
  onChange?: (result: any) => void;
  onChangeValue?: (value: string) => void;
  onBlur?: () => void;
  style?: ViewStyle;
  placeholder?: string;
}

export default observer((props: IDocumentPicker) => {
  const {
    handlePress,
    label,
    style,
    clearSource,
    value,
  } = generateDocumentPicker(props);
  const Theme: ITheme = useTheme() as any;

  return (
    <>
      <Button mode="clean" onPress={handlePress} style={style}>
        <Icon
          name={!!value ? "document" : "cloud-upload"}
          size={50}
          color={Theme.colors.text}
        />
        <Text>{label}</Text>
      </Button>
      {!!value && (
        <Button
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
            backgroundColor: Theme.colors.card,
          }}
          onPress={clearSource}
        >
          <Icon
            name="ios-close-circle"
            color={Theme.colors.notification}
            size={30}
          />
        </Button>
      )}
    </>
  );
});
