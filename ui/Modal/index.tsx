import { observer } from "mobx-react";
import React from "react";
import {
  Modal,
  ModalProps as ModalPropsOrigin,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Screen, { IScreenProps } from "../Screen";

export interface ModalProps extends ModalPropsOrigin {
  style?: ViewStyle;
  children?: any;
  screenProps?: IScreenProps;
}

export default observer((props: ModalProps) => {
  const { style, children, screenProps } = props;
  const baseStyle: ViewStyle = {
    backgroundColor: "#00000060",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  };
  const cstyle = StyleSheet.flatten([baseStyle, style, screenProps?.style]);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      {...props}
    >
      <Screen
        statusBar={{
          barStyle: "light-content",
        }}
        {...screenProps}
        style={cstyle}
      >
        {children}
      </Screen>
    </Modal>
  );
});
