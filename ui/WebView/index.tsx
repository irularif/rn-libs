import { useTheme } from "@react-navigation/native";
import { ITheme } from "libs/config/theme";
import React from "react";
import { Dimensions } from "react-native";
import { WebView, WebViewProps } from "react-native-webview";
import Image from "../Image";
import Spinner from "../Spinner";
import View from "../View";

export interface IWebViewProps extends WebViewProps {}

export default (props: IWebViewProps) => {
  return (
    <WebView
      originWhitelist={["*", "intent://*"]}
      scalesPageToFit={true}
      textZoom={100}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState
      allowFileAccess={true}
      geolocationEnabled={true}
      saveFormDataDisabled={true}
      allowUniversalAccessFromFileURLs={true}
      cacheEnabled={true}
      renderLoading={() => <LoadingScreen webViewProps={props} />}
      {...props}
    />
  );
};

const LoadingScreen = (props: any) => {
  const dim = Dimensions.get("window");
  const Theme: ITheme = useTheme() as any;

  return (
    <View
      style={{
        backgroundColor: Theme.colors.background,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Image
        source={Theme.loadingImage}
        style={{
          width: dim.width,
          height: "100%",
        }}
      />
      <Spinner
        style={{
          alignSelf: "center",
          marginTop: 20,
        }}
        color={Theme.colors.primary}
      />
    </View>
  );
};
