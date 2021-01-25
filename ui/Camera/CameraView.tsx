import { useTheme } from "@react-navigation/native";
import { Camera, CameraPictureOptions, CameraProps } from "expo-camera";
import { ITheme } from "libs/config/theme";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import Image from "../Image";
import libsStorage from "../libsStorage";
import Modal from "../Modal";
import Spinner from "../Spinner";
import Text from "../Text";
import View from "../View";
import {
  generateActions,
  generateCameraView,
  generateTools,
} from "./generator";

export interface ICameraView extends CameraProps {
  cameraRef?: MutableRefObject<any>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  source: string;
  setSource: (uri: string) => void;
  option?: CameraPictureOptions;
  withCompress?: boolean;
  disableImagePicker?: boolean;
}

export interface ICameraViewProps {
  width: number;
  height: number;
  cameraProps: ICameraView;
  meta: any;
  camera: MutableRefObject<any>;
  requestPermission: () => void;
  disableImagePicker: boolean;
  onSave: () => void;
  onDismiss: () => void;
  option?: CameraPictureOptions;
  withCompress?: boolean;
}

export default observer((props: ICameraView) => {
  const { visible } = props;
  const camViewRef: any = useRef(null);
  const dim = Dimensions.get("window");
  const meta = useLocalObservable(() => ({
    tempURI: "",
    loading: false,
  }));
  const cprops = generateCameraView(props, meta, camViewRef);

  if (
    !visible ||
    !libsStorage.hasCameraPermission ||
    !libsStorage.hasImagePickPermission
  ) {
    cprops.requestPermission();
    return null;
  }

  return (
    <Modal
      visible={visible}
      onDismiss={cprops.onDismiss}
      onRequestClose={cprops.onDismiss}
    >
      <View
        style={{
          backgroundColor: "#000000",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: dim.width,
        }}
      >
        <CameraView {...cprops} meta={meta} />
        <ActionGroupTop {...cprops} meta={meta} />
        <ActionGroupBottom {...cprops} meta={meta} />
      </View>
    </Modal>
  );
});

const CameraView = observer((props: ICameraViewProps) => {
  const { width, height, cameraProps, meta, camera } = props;
  const Theme: ITheme = useTheme() as any;

  if (!!meta.tempURI) {
    return (
      <Image
        source={{ uri: meta.tempURI }}
        style={{
          width,
          height,
        }}
        resizeMode="contain"
      />
    );
  }

  return (
    <Camera
      {...cameraProps}
      ref={camera}
      style={{
        backgroundColor: "red",
        width,
        height,
      }}
    >
      {!!meta.loading && (
        <View
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner
            style={{
              backgroundColor: Theme.colors.card,
              borderRadius: 8,
              padding: 10,
              alignSelf: "center",
            }}
          />
        </View>
      )}
    </Camera>
  );
});

const ActionGroupTop = observer((props: ICameraViewProps) => {
  const { meta } = props;
  const Theme: ITheme = useTheme() as any;
  const { ratio, flashMode, switchRatio, switchFlashMode } = generateTools();

  if (!!meta.tempURI) return null;

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 10,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        shadow
        style={{
          backgroundColor: Theme.colors.card,
          paddingHorizontal: 10,
          borderRadius: 8,
          marginHorizontal: 10,
          marginVertical: 20,
          flexDirection: "row",
          height: 45,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActionFlash flashMode={flashMode} switchFlashMode={switchFlashMode} />
        <View
          style={{
            width: 1,
            height: 35,
            marginHorizontal: 5,
            backgroundColor: Theme.colors.border,
          }}
        />
        <ActionRatio ratio={ratio} switchRatio={switchRatio} />
      </View>
    </View>
  );
});

const ActionGroupBottom = observer((props: ICameraViewProps) => {
  const {
    camera,
    meta,
    option,
    disableImagePicker,
    onSave,
    withCompress,
  } = props;
  const Theme: ITheme = useTheme() as any;
  const { switchType } = generateTools();
  const { actionSnap, actionReset, actionPick } = generateActions(
    camera,
    meta,
    option,
    withCompress
  );

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        shadow
        style={{
          backgroundColor: Theme.colors.card,
          paddingHorizontal: 10,
          borderRadius: 8,
          marginHorizontal: 10,
          marginVertical: 20,
          flexDirection: "row",
          height: 45,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActionSwitchCam switchType={switchType} meta={meta} />
        <ActionSnap
          actionSnap={actionSnap}
          actionReset={actionReset}
          meta={meta}
        />
        <ActionPickImage
          meta={meta}
          actionPick={actionPick}
          disableImagePicker={disableImagePicker}
        />
        <ActionSave onSave={onSave} meta={meta} />
      </View>
    </View>
  );
});

const ActionSnap = observer(({ actionSnap, actionReset, meta }: any) => {
  const Theme: ITheme = useTheme() as any;

  if (!!meta.tempURI) {
    return (
      <Button
        mode="clean"
        style={{
          paddingVertical: 0,
          paddingHorizontal: 5,
          margin: 0,
        }}
        onPress={actionReset}
      >
        <Icon name="md-refresh" color={Theme.colors.text} size={30} />
      </Button>
    );
  }

  return (
    <Button
      style={{
        borderRadius: 999,
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: 70,
        height: 70,
        marginHorizontal: 20,
        backgroundColor: Theme.colors.secondary,
      }}
      disabled={meta.loading}
      onPress={actionSnap}
    >
      <View
        style={{
          backgroundColor: Theme.colors.primary,
          width: 60,
          height: 60,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </Button>
  );
});

const ActionSwitchCam = observer(({ switchType, meta }: any) => {
  const Theme: ITheme = useTheme() as any;

  if (!!meta.tempURI) return null;

  return (
    <Button
      mode="clean"
      style={{
        paddingVertical: 0,
        paddingHorizontal: 5,
        margin: 0,
      }}
      onPress={switchType}
    >
      <Icon name="ios-camera-reverse" color={Theme.colors.text} size={34} />
    </Button>
  );
});

const ActionPickImage = observer(
  ({ meta, actionPick, disableImagePicker }: any) => {
    const Theme: ITheme = useTheme() as any;

    if (!!disableImagePicker || !!meta.tempURI) return null;

    return (
      <Button
        mode="clean"
        style={{
          paddingVertical: 0,
          paddingHorizontal: 5,
          margin: 0,
        }}
        onPress={actionPick}
      >
        <Icon name="ios-images" color={Theme.colors.text} size={28} />
      </Button>
    );
  }
);

const ActionRatio = observer(({ ratio, switchRatio }: any) => {
  const Theme: ITheme = useTheme() as any;

  return (
    <Button
      mode="clean"
      style={{
        paddingVertical: 0,
        paddingHorizontal: 5,
        margin: 0,
      }}
      onPress={switchRatio}
    >
      <Text
        style={{
          fontFamily: Theme.fontStyle.bold,
        }}
      >
        [{ratio}]
      </Text>
    </Button>
  );
});

const ActionFlash = observer(({ flashMode, switchFlashMode }: any) => {
  const Theme: ITheme = useTheme() as any;

  return (
    <Button
      mode="clean"
      style={{
        paddingVertical: 0,
        paddingHorizontal: 5,
        margin: 0,
      }}
      onPress={switchFlashMode}
    >
      {flashMode === "auto" ? (
        <Text
          style={{
            fontFamily: Theme.fontStyle.bold,
          }}
        >
          Auto
        </Text>
      ) : (
        <Icon
          name={flashMode === "on" ? "ios-flash" : "ios-flash-off"}
          color={Theme.colors.text}
          size={24}
        />
      )}
    </Button>
  );
});

const ActionSave = observer(({ onSave, meta }: any) => {
  const Theme: ITheme = useTheme() as any;

  if (!meta.tempURI) return null;

  return (
    <Button
      style={{
        borderRadius: 999,
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: 70,
        height: 70,
        backgroundColor: Theme.colors.primary,
      }}
      onPress={onSave}
    >
      <View
        style={{
          backgroundColor: Theme.colors.secondary,
          width: 60,
          height: 60,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name="md-checkmark" color={Theme.colors.textLight} size={34} />
      </View>
    </Button>
  );
});
