import {
  useIsFocused,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { ITheme } from "libs/config/theme";
import get from "lodash.get";
import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react";
import React, { ReactElement, useEffect } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  TextStyle,
  ViewProps,
  ViewStyle,
} from "react-native";
import Button, { IButtonProps } from "../Button";
import Icon, { IIcon } from "../Icon";
import { statusBarHeight } from "../Screen";
import Text, { ITextProps } from "../Text";
import View from "../View";
import { generateTopBar } from "./generator";

export interface ITopBarProps extends ViewProps {
  backButton?: boolean;
  actionBackButton?: () => void;
  enableShadow?: boolean;
  children: string | ReactElement;
  leftAction?: any;
  rightAction?: any;
  styles?: {
    backButton?: ViewStyle;
    iconBackButton?: ViewStyle;
    title?: TextStyle;
  };
  iconProps?: Partial<IIcon>;
}

export default (props: ITopBarProps) => {
  const meta = useLocalObservable(() => ({
    exit: false,
  }));
  const {
    style,
    enableShadow,
    backButton,
    children,
    leftAction,
    rightAction,
    iconProps,
    styles,
    onPressBack,
  } = generateTopBar(props, meta);
  const Theme: ITheme = useTheme() as any;
  const shadowStyle = enableShadow !== false ? Theme.shadow : {};

  const baseStyle: ViewStyle = {
    paddingTop: 8 + statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
    height: 56 + statusBarHeight,
    backgroundColor: Theme.colors.primary,
    zIndex: 9,
    margin: 0,
    paddingBottom: 8,
  };
  const cstyle = StyleSheet.flatten([baseStyle, shadowStyle, style]);
  const backButtonStyle: ViewStyle = StyleSheet.flatten([
    {
      margin: 0,
      marginHorizontal: 5,
      paddingHorizontal: 5,
      justifyContent: "flex-start",
    },
    styles?.backButton,
  ]);
  const titleStyle: TextStyle = StyleSheet.flatten([
    {
      lineHeight: 30,
      fontSize: 18,
      color: "white",
      overflow: "hidden",
      flexGrow: 1,
    },
    styles?.title,
  ]);

  return (
    <View {...props} style={cstyle}>
      {backButton && (
        <Button mode="clean" style={backButtonStyle} onPress={onPressBack}>
          <Icon
            name={`${Platform.OS === "ios" ? "ios" : "md"}-arrow-back`}
            size={24}
            style={StyleSheet.flatten([
              {
                margin: 0,
              },
              styles?.iconBackButton,
            ])}
            color={Theme.colors.textLight}
            {...iconProps}
          />
        </Button>
      )}
      {leftAction}
      {typeof children === "string" ? (
        <Text ellipsizeMode={"tail"} numberOfLines={1} style={titleStyle}>
          {children}
        </Text>
      ) : (
        children
      )}
      {rightAction}
    </View>
  );
};
