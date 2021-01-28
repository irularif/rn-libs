import Fonts from "../assets/fonts";
import { StatusBarProps, StyleSheet, TextStyle, ViewStyle } from "react-native";
import {
  DefaultTheme as DefaultThemeOrigin,
  DarkTheme as DarkThemeOrigin,
} from "app/config/theme";

export interface ITheme {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    textLight: string;
    border: string;
    notification: string;
    [key: string]: string;
  };
  fontStyle: {
    light: string;
    lightItalic: string;
    regular: string;
    regularItalic: string;
    bold: string;
    boldItalic: string;
  };
  fontSize: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  shadow: any;
  statusBar: StatusBarProps;
  styles: {
    field?: ViewStyle;
    input?: TextStyle;
    button?: ViewStyle;
  };
  errorImage: any;
  loadingImage: any;
  splashImage: any;
}

export const DefaultTheme: ITheme = Object.assign(
  {
    dark: false,
    colors: {
      primary: "rgb(255, 45, 85)",
      secondary: "rgb(255, 45, 85)",
      background: "rgb(242, 242, 242)",
      card: "rgb(255, 255, 255)",
      text: "rgb(28, 28, 30)",
      textLight: "rgb(255, 255, 255)",
      border: "rgb(199, 199, 204)",
      notification: "rgb(255, 69, 58)",
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    statusBar: {
      barStyle: "dark-content",
      backgroundColor: "#ffffff",
    },
    fontSize: {
      h1: 24,
      h2: 20,
      h3: 18,
      h4: 16,
      h5: 15,
      h6: 14,
    },
    fontStyle: {
      light: Fonts.RobotoLight,
      lightItalic: Fonts.RobotoLightItalic,
      regular: Fonts.Roboto,
      regularItalic: Fonts.RobotoItalic,
      bold: Fonts.RobotoBold,
      boldItalic: Fonts.RobotoBoldItalic,
    },
    styles: StyleSheet.create({
      field: {},
      input: {},
      button: {},
    }),
    errorImage: require("../assets/images/error.png"),
    loadingImage: require("../assets/images/loading.png"),
    splashImage: require("../assets/images/splash.png"),
  },
  DefaultThemeOrigin
);

export const DarkTheme: ITheme = Object.assign(
  { ...DefaultTheme },
  {
    dark: true,
    colors: {
      primary: "rgb(10, 132, 255)",
      secondary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(18, 18, 18)",
      text: "rgb(229, 229, 231)",
      border: "rgb(39, 39, 41)",
      notification: "rgb(255, 69, 58)",
    },
    shadow: {
      shadowColor: "#fff",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    statusBar: {
      StatusBarStyle: "light-content",
      StatusBarBackgroundColor: "#010101",
    },
  },
  DarkThemeOrigin
);
