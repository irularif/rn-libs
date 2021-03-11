import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { ReactElement } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { ImageStyle } from "react-native-fast-image";
import Button from "../Button";
import Icon from "../Icon";
import Image from "../Image";
import Text from "../Text";
import View from "../View";
import CameraView, { ICameraView } from "./CameraView";
import { generateCamera } from "./generator";

export interface ICamera {
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
  cameraView?: ICameraView;
  placeholder?: string;
}

export default observer((props: ICamera) => {
  const { style, editable } = props;
  const meta = useLocalObservable(() => ({
    visbleCameraView: false,
  }));
  const cprops = generateCamera(props, meta);
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
      <Icon name="ios-camera" size={60} color={Theme.colors.text} />
      <Text>{placeholder || "Press to open camera"}</Text>
    </View>
  );
});

const CameraSegment = observer((props: any) => {
  const { value, setSource, meta, cameraView } = props;

  if (!meta.visbleCameraView) return null;

  return (
    <CameraView
      withCompress
      {...cameraView}
      visible={meta.visbleCameraView}
      setVisible={(visible) => {
        runInAction(() => {
          meta.visbleCameraView = !visible;
        });
      }}
      source={value}
      setSource={setSource}
    />
  );
});
