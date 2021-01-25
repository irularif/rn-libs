import customFonts from "app/assets/fonts";

export const sourceFonts = {
  Roboto: require("./Roboto-Regular.ttf"),
  RobotoItalic: require("./Roboto-Italic.ttf"),
  RobotoBold: require("./Roboto-Bold.ttf"),
  RobotoLight: require("./Roboto-Light.ttf"),
  RobotoLightItalic: require("./Roboto-LightItalic.ttf"),
  RobotoBoldItalic: require("./Roboto-BoldItalic.ttf"),
  ...(customFonts || {}),
};

function generateFont<T>(source: T): T {
  let fonts: any = {};
  Object.keys(source).map((x: string) => {
    fonts[x] = x;
  });

  return fonts as T;
}

const Fonts = generateFont(sourceFonts);
export default Fonts;
