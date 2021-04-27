import { useTheme } from "@react-navigation/native";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { ReactElement } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { ImageStyle } from "react-native-fast-image";
import { ITheme } from "../../config/theme";
import Button from "../Button";
import Icon from "../Icon";
import Image from "../Image";
import Text from "../Text";
import View from "../View";
import Canvas, { ICanvas } from "./Canvas";
import { generateSketchCanvas } from "./generator";

export interface ISketchCanvas {
  value?: string;
  editable?: boolean;
  onChange?: (uri: string) => string | null;
  onChangeValue?: (value: string) => void;
  onBlur?: () => void;
  style?: ViewStyle;
  styles?: {
    thumbnail?: ImageStyle;
  };
  renderPreview?: (uri: string) => ReactElement;
  canvasView?: Partial<ICanvas>;
  placeholder?: string;
  prefixUri?: string;
}

export default observer((props: ISketchCanvas) => {
  const { style, editable } = props;
  const meta = useLocalObservable(() => ({
    visbleCanvasView: false,
  }));
  const cprops = generateSketchCanvas(props, meta);
  const baseStyle: ViewStyle = {
    margin: 0,
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    flexDirection: "column",
    position: "relative",
    flex: 1,
    height: 150,
  };
  const cstyle = StyleSheet.flatten([baseStyle, style]);

  return (
    <>
      <Button
        mode={"clean"}
        style={cstyle}
        onPress={cprops.switchCameraView}
        disabled={editable === false}
      >
        <Preview {...cprops} />
      </Button>
      <CameraSegment {...cprops} meta={meta} />
    </>
  );
});

const Preview = observer((props: any) => {
  const { source, renderPreview, clearSource, styles, placeholder } = props;
  const Theme: ITheme = useTheme() as any;

  if (!!renderPreview) {
    return renderPreview(props);
  }

  if (!!source?.uri) {
    const cstyle = StyleSheet.flatten([
      {
        height: 150,
        width: "100%",
      },
      styles?.thumbnail,
    ]);
    return (
      <>
        <Image source={source} resizeMode="cover" style={cstyle} />
        <Button
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
            backgroundColor: Theme.colors.card,
          }}
          onPress={clearSource}
        >
          <Icon
            name="ios-close-circle"
            color={Theme.colors.notification}
            size={30}
          />
        </Button>
      </>
    );
  }

  return (
    <View
      style={{
        paddingVertical: 15,
        alignItems: "center",
      }}
    >
      <Icon name="create" size={60} color={Theme.colors.text} />
      <Text>{placeholder || "Press to open canvas"}</Text>
    </View>
  );
});

const CameraSegment = observer((props: any) => {
  const { setSource, meta, canvasView, source } = props;

  if (!meta.visbleCanvasView) return null;

  return (
    <Canvas
      withCompress
      {...canvasView}
      visible={meta.visbleCanvasView}
      setVisible={(visible: boolean) => {
        runInAction(() => {
          meta.visbleCanvasView = !visible;
        });
      }}
      source={source?.uri}
      setSource={setSource}
    />
  );
});
