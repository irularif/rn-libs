import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ITheme } from "../../config/theme";

export interface IViewProps extends ViewProps {
  shadow?: boolean;
  childRef?: any;
  children?: any;
}

export default observer((props: IViewProps) => {
  const { shadow, style, childRef } = props;
  const Theme: ITheme = useTheme() as any;
  const shadowStyle = !!shadow ? Theme.shadow : {};
  let cstyle = StyleSheet.flatten([shadowStyle, style]);

  return <View {...props} style={cstyle} ref={childRef} />;
});
