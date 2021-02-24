import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import get from "lodash.get";
import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import Text from "../Text";

interface IStyles {
  disabled?: ViewStyle;
  label?: TextStyle;
}

export interface IButtonProps extends TouchableOpacityProps {
  shadow?: Boolean;
  type?: "Submit" | string;
  children?: any;
  mode?: "contained" | "outlined" | "clean";
  styles?: IStyles;
  label?: string;
  style?: ViewStyle;
}

export default (props: IButtonProps) => {
  const { disabled, shadow, mode = "contained", children, label } = props;
  const Theme: ITheme = useTheme() as any;
  const cprops = { ...props };
  delete cprops.styles;
  const disabledStyle = StyleSheet.flatten([
    {
      opacity: 0.5,
    },
    props?.styles?.disabled,
  ]);
  const shadowStyle = !!shadow ? Theme.shadow : {};
  const containedStyle: ViewStyle = {
    backgroundColor: Theme.colors.primary,
  };
  const outlinedStyle: ViewStyle = {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Theme.colors.primary,
    backgroundColor: "transparent",
  };
  const cleanStyle: ViewStyle = {
    backgroundColor: "transparent",
  };
  const cstyle: ViewStyle = StyleSheet.flatten([
    {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
      padding: 16,
      paddingVertical: 8,
      margin: 4,
    },
    shadowStyle,
    Theme.styles?.button,
    mode === "outlined"
      ? outlinedStyle
      : mode === "clean"
      ? cleanStyle
      : containedStyle,
    props?.style,
    disabled !== true ? {} : disabledStyle,
  ]);

  return (
    <TouchableOpacity activeOpacity={0.6} {...cprops} style={cstyle}>
      {!children && !!label ? (
        <Text style={get(props, "styles.label", {})}>{label}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
