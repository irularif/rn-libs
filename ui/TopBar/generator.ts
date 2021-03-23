import { useIsFocused, useNavigation } from "@react-navigation/native";
import { runInAction } from "mobx";
import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { ITopBarProps } from ".";

export const generateTopBar = (props: ITopBarProps, meta: any) => {
  const {
    style,
    enableShadow,
    backButton,
    children,
    leftAction,
    rightAction,
    iconProps,
    styles,
    actionBackButton,
  } = props;
  const { goBack, canGoBack } = useNavigation();
  const isFocused = useIsFocused();

  const onPressBack = !!actionBackButton
    ? actionBackButton
    : () => {
        if (!!canGoBack()) {
          goBack();
          if (!!meta.exit) runInAction(() => (meta.exit = false));
        } else {
          if (!!meta.exit) {
            Alert.alert("Exit", "Are you sure you want to exit?", [
              {
                text: "Cancel",
                onPress: () => runInAction(() => (meta.exit = false)),
                style: "cancel",
              },
              { text: "YES", onPress: () => BackHandler.exitApp() },
            ]);
          } else {
            runInAction(() => (meta.exit = true));
          }
        }
      };

  useEffect(() => {
    let backHandler: any;
    if (!!isFocused) {
      backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        onPressBack();
        return true;
      });
    }
    console.log(backHandler);

    return () => {
      if (!!backHandler) {
        backHandler.remove();
      }
    };
  }, [isFocused]);

  return {
    style,
    enableShadow,
    backButton,
    children,
    leftAction,
    rightAction,
    iconProps,
    styles,
    onPressBack,
  };
};
