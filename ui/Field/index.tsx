import { useTheme } from "@react-navigation/native";
import { get } from "lodash";
import { observer } from "mobx-react";
import React, { ReactElement } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { ITheme } from "../../config/theme";
import Camera from "../Camera";
import Checkbox from "../Checkbox";
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
  children: ReactElement;
  style?: ViewStyle;
  styles?: {
    fieldGroup?: ViewStyle;
    field?: ViewStyle;
    input?: ViewStyle;
    label?: TextStyle;
    errorMessage?: TextStyle;
  };
  initializeField?: IFormField;
  editable?: boolean;
  onChange?: (value: any) => void;
  setValue?: (value: any) => any;
  onBlur?: () => void;
  Prefix?: ReactElement;
  Suffix?: ReactElement;
  Info?: ReactElement;
}

export default observer((props: IField) => {
  const {
    label,
    hiddenLabel,
    Prefix,
    Suffix,
    style,
    styles,
    editable,
    Info,
  } = props;
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
    borderRadius: 4,
    flexShrink: 1,
  };
  let removedBgInput = {};
  switch (Input.type) {
    case Checkbox:
    case ChoiceGroup:
      baseStyle = {
        ...baseStyle,
        borderWidth: 0,
        paddingHorizontal: 0,
        backgroundColor: "transparent",
        flexGrow: 0,
      };
      removedBgInput = {
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
  const cstyle = StyleSheet.flatten([
    {
      marginBottom: 15,
      flexShrink: 1,
    },
    Theme.styles?.fieldGroup,
    styles?.fieldGroup,
    style,
  ]);
  const fstyle = StyleSheet.flatten([
    { flexShrink: 1 },
    Theme.styles?.field,
    styles?.field,
  ]);
  const cstyleInput = StyleSheet.flatten([
    baseStyle,
    Theme.styles?.input,
    removedBgInput,
    styles?.input,
  ]);
  const cstyleLabel = StyleSheet.flatten([
    {
      color: Theme.colors.text,
      marginBottom: 5,
      marginHorizontal: 5,
      fontSize: Theme.fontSize?.h6,
      fontFamily: Theme.fontStyle?.bold,
    },
    styles?.label,
  ]);

  return (
    <View style={cstyle}>
      <View style={fstyle}>
        {hiddenLabel != true &&
          (typeof label === "string" ? (
            <Text style={cstyleLabel}>{label}</Text>
          ) : (
            label
          ))}
        <View style={cstyleInput}>
          {Prefix}
          {Input}
          {Suffix}
        </View>
      </View>
      {Info}
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
    !!get(meta?.touched, path) &&
    !!get(meta?.errors, path)
  ) {
    return <Text style={cstyle}>{get(meta?.errors, path)}</Text>;
  }
  return null;
});
