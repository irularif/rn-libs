import { useTheme } from "@react-navigation/native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { observer } from "mobx-react";
import React from "react";
import { StyleSheet } from "react-native";
import { ITheme } from "../../config/theme";

export interface ILinearGradientPropsProps extends LinearGradientProps {
  shadow?: boolean;
  childRef?: any;
  children?: any;
}

export default observer((props: ILinearGradientPropsProps) => {
  const { shadow, style, childRef } = props;
  const Theme: ITheme = useTheme() as any;
  const shadowStyle = !!shadow ? Theme.shadow : {};
  let cstyle = StyleSheet.flatten([shadowStyle, style]);

  return <LinearGradient {...props} style={cstyle} ref={childRef} />;
});
