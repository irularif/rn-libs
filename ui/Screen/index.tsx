import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StatusBarProps,
  StyleSheet,
} from "react-native";
import { SafeAreaViewProps } from "react-native-safe-area-context";
import { ITheme } from "../../config/theme";
import View from "../View";

export interface IScreenProps extends SafeAreaViewProps {
  children?: ReactNode;
  statusBar?: StatusBarProps;
}

export const statusBarHeight: number =
  Platform.OS === "android" && !!StatusBar.currentHeight
    ? StatusBar.currentHeight
    : 0;

export default observer((props: IScreenProps) => {
  const { style, statusBar } = props;
  const Theme: ITheme = useTheme() as any;
  let cstyle = StyleSheet.flatten([
    {
      flexGrow: 1,
      flexShrink: 1,
      backgroundColor: Theme.colors.background,
      padding: 0,
      margin: 0,
    },
    style,
  ]);
  return (
    <SafeAreaView {...props} style={cstyle}>
      <View
        style={{
          height: statusBarHeight,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <StatusBar
          animated={true}
          translucent={true}
          {...Theme.statusBar}
          {...statusBar}
        />
      </View>
      {props.children}
    </SafeAreaView>
  );
});
