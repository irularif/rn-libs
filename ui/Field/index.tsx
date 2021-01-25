import { useTheme } from "@react-navigation/native";
import { ITheme } from "libs/config/theme";
import { observer } from "mobx-react";
import React, { ReactElement } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import Checkbox from "../Checkbox";
import Camera from "../Camera";
import ChoiceGroup from "../ChoiceGroup";
import { IField as IFormField } from "../Form";
import Text from "../Text";
import View from "../View";
import { generateInput } from "./generator";

export interface IField {
  label: string | ReactElement;
  hiddenLabel?: boolean;
  path: string;
  value?: string;
  Prefix?: ReactElement;
  Suffix?: ReactElement;
  children: ReactElement;
  style?: ViewStyle;
  styles?: {
    field?: ViewStyle;
    inputWrapper?: ViewStyle;
    label?: TextStyle;
    errorMessage?: TextStyle;
  };
  initializeField?: IFormField;
  editable?: boolean;
  onChange?: (value: any) => void;
}

export default observer((props: IField) => {
  const { label, hiddenLabel, Prefix, Suffix, style, styles, editable } = props;
  const Theme: ITheme = useTheme() as any;
  const Input = generateInput(props);

  let baseStyle: ViewStyle = {
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor:
      editable === false ? Theme.colors.background : Theme.colors.card,
    alignItems: "center",
    paddingHorizontal: 5,
    borderRadius: 4,
  };
  switch (Input.type) {
    case Checkbox:
    case ChoiceGroup:
      baseStyle = {
        ...baseStyle,
        borderWidth: 0,
        backgroundColor: "transparent",
      };
      break;
    case Camera:
      baseStyle = {
        ...baseStyle,
        paddingHorizontal: 0,
      };
      break;
  }

  // Styles
  const cstyleInputWraper = StyleSheet.flatten([
    baseStyle,
    Theme.styles.field,
    styles?.inputWrapper,
  ]);
  const cstyle = StyleSheet.flatten([
    {
      marginBottom: 20,
    },
    styles?.field,
    style,
  ]);
  const cstyleLabel = StyleSheet.flatten([
    {
      color: Theme.colors.text,
      marginBottom: 8,
      marginHorizontal: 5,
      fontSize: Theme.fontSize.h6,
      fontFamily: Theme.fontStyle.bold,
    },
    styles?.label,
  ]);

  return (
    <View style={cstyle}>
      {hiddenLabel != true &&
        (typeof label === "string" ? (
          <Text style={cstyleLabel}>{label}</Text>
        ) : (
          label
        ))}
      <View style={cstyleInputWraper}>
        {Prefix}
        {Input}
        {Suffix}
      </View>
      <ErrorMessage {...props} />
    </View>
  );
});

const ErrorMessage = observer((props: Partial<IField>) => {
  const Theme: ITheme = useTheme() as any;
  const { path, styles, initializeField } = props;
  if (!initializeField) return null;
  const { meta }: any = initializeField;
  const cstyle = StyleSheet.flatten([
    {
      color: Theme.colors.notification,
      fontSize: 13,
      marginHorizontal: 5,
      marginTop: 4,
    },
    !!styles && styles.errorMessage,
  ]);
  if (
    !!path &&
    !!meta?.touched &&
    !!meta?.errors &&
    !!meta?.touched[path] &&
    !!meta?.errors[path]
  ) {
    return <Text style={cstyle}>{meta.errors[path]}</Text>;
  }
  return null;
});
