import { useTheme } from "@react-navigation/native";
import { DefaultTheme, ITheme } from "libs/config/theme";
import React from "react";
import { Dimensions } from "react-native";
import ImageBackground from "../ImageBackground";
import Screen from "../Screen";
import Spinner from "../Spinner";
import View from "../View";

export default () => {
  const Theme: ITheme = useTheme() as any;
  const dim = Dimensions.get("screen");
  const portrait = dim.width > dim.height ? false : true;
  const height = portrait ? "100%" : dim.height;
  const width = portrait ? dim.width : "100%";
  const splash = DefaultTheme.splashImage;

  return (
    <Screen
      statusBar={{
        backgroundColor: "#00000000",
      }}
    >
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
        </View>
      </ImageBackground>
    </Screen>
  );
};
