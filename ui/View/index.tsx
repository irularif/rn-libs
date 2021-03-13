import { useTheme } from "@react-navigation/native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ITheme } from "../../config/theme";

export interface IViewProps extends ViewProps, Partial<LinearGradientProps> {
  type?: "View" | "LinearGradient";
  shadow?: boolean;
  viewRef?: any;
  children?: ReactNode;
}

export default observer((props: IViewProps) => {
  const { type, shadow, style, viewRef } = props;
  const Theme: ITheme = useTheme() as any;
  const shadowStyle = !!shadow ? Theme.shadow : {};
  let cstyle = StyleSheet.flatten([shadowStyle, style]);

  switch (type) {
    case "LinearGradient":
      return (
        <LinearGradient {...(props as any)} ref={viewRef} style={cstyle} />
      );
    default:
      return <View {...props} style={cstyle} ref={viewRef} />;
  }
});
