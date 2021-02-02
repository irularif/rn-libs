import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import React from "react";
import {
  StyleSheet,
  Text,
  TextProps as OriginTextProps,
  TextStyle,
} from "react-native";

export interface ITextProps extends OriginTextProps {
  children: any;
}

export default (props: ITextProps) => {
  const { style } = props;
  const Theme: ITheme = useTheme() as any;
  const baseStyle: TextStyle = {
    fontSize: Theme?.fontSize?.h6 || 14,
    fontFamily: Theme?.fontStyle?.regular,
    color: Theme?.colors?.text,
  };
  const cstyle = StyleSheet.flatten([baseStyle, style]);

  return <Text {...props} style={cstyle} />;
};
