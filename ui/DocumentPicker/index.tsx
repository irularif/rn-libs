import { observer } from "mobx-react";
import React from "react";
import * as DocumentPicker from "expo-document-picker";
import { ViewStyle } from "react-native";
import Button from "../Button";
import { generateDocumentPicker } from "./generator";
import Icon from "../Icon";
import { ITheme } from "libs/config/theme";
import { useTheme } from "@react-navigation/native";
import Text from "../Text";

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
    value,
    clearSource,
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
