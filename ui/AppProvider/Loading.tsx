import React from "react";
import { Dimensions } from "react-native";
import Theme from "../../config/theme";
import ImageBackground from "../ImageBackground";
import Screen from "../Screen";
import Spinner from "../Spinner";
import View from "../View";

export default () => {
  const dim = Dimensions.get("screen");

  return (
    <Screen>
      <ImageBackground
        source={Theme.UISplashScreen}
        style={{
          backgroundColor: "#fff",
        }}
        imageStyle={{
          height: dim.height,
          width: "100%",
        }}
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
            color={Theme.UIColors.primary}
          ></Spinner>
        </View>
      </ImageBackground>
    </Screen>
  );
};
