import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Dimensions, StyleSheet, ViewStyle } from "react-native";
import FastImage, { FastImageProps, ImageStyle } from "react-native-fast-image";
import Button from "../Button";
import Modal from "../Modal";

export interface IImage extends FastImageProps {
  enablePreview?: boolean;
  style?: ImageStyle;
  styles?: {
    root?: ViewStyle;
  };
}

export default observer((props: IImage) => {
  const { styles, enablePreview } = props;
  const meta = useLocalObservable(() => ({
    visible: false,
  }));
  const switchVisible = () => {
    runInAction(() => (meta.visible = !meta.visible));
  };
  const buttonStyle: ImageStyle = {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    margin: 0,
  };
  const cstyle = StyleSheet.flatten([buttonStyle, styles?.root]);

  if (!props.source && !(props.source as any).uri) return null;

  return (
    <>
      <Button
        mode="clean"
        activeOpacity={enablePreview ? 0.7 : 1}
        style={cstyle}
        disabled={!enablePreview}
        onPress={switchVisible}
        styles={{
          disabled: {
            opacity: 1,
          },
        }}
      >
        <ImageThumbnail {...props} />
      </Button>

      <ImagePreview {...props} meta={meta} switchVisible={switchVisible} />
    </>
  );
});

const ImageThumbnail = observer((props: IImage) => {
  const { style } = props;
  const baseStyle = {
    width: 300,
    height: "100%",
  };
  const cstyle = StyleSheet.flatten([baseStyle, style]);
  return <FastImage resizeMode="contain" {...props} style={cstyle} />;
});

const ImagePreview = observer((props: any) => {
  const { meta, switchVisible } = props;
  const dim = Dimensions.get("window");
  const baseStyle = {
    width: dim.width,
    height: "100%",
  };

  if (!meta.visible) return null;

  return (
    <Modal
      visible={meta.visible}
      onDismiss={switchVisible}
      onRequestClose={switchVisible}
      screenProps={{
        style: {
          backgroundColor: "#000000",
        },
      }}
    >
      <FastImage resizeMode="contain" {...props} style={baseStyle} />;
    </Modal>
  );
});
