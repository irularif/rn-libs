import { useTheme } from "@react-navigation/native";
import React from "react";
import { Dimensions } from "react-native";
import { DefaultTheme, ITheme } from "../../config/theme";
import ImageBackground from "../ImageBackground";
import Screen from "../Screen";
import Spinner from "../Spinner";
import Text from "../Text";
import View from "../View";

export default (props: any) => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("screen");
  let message = props.syncMessage;
  let progress = "";
  if (!!props.progress) {
    let dl = (props.progress.receivedBytes / props.progress.totalBytes) * 100;
    progress = `(${dl.toFixed(1)}%)`;
  }
  const portrait = dim.width > dim.height ? false : true;
  const height = portrait ? "100%" : dim.height;
  const width = portrait ? dim.width : "100%";
  const splash = DefaultTheme.splashImage;

  return (
    <Screen>
      <ImageBackground
        source={splash}
        imageStyle={{
          height,
          width,
        }}
        resizeMode="center"
      >
        <View
          style={{
            position: "absolute",
            bottom: 50,
            left: 20,
            right: 20,
            padding: 15,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Spinner
            style={{
              alignSelf: "center",
            }}
            color={Theme.colors.primary}
          ></Spinner>
          <Text
            style={{
              fontSize: 13,
              marginLeft: 10,
            }}
          >
            {message}
            {progress}
          </Text>
        </View>
      </ImageBackground>
    </Screen>
  );
};
