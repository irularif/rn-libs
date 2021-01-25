import { useTheme } from "@react-navigation/native";
import { ITheme } from "libs/config/theme";
import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

export default (props: ActivityIndicatorProps) => {
  const Theme: ITheme = useTheme() as any;

  return <ActivityIndicator color={Theme.colors.primary} {...props} />;
};
