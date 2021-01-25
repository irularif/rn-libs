import { Camera, CameraPictureOptions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import imagePicker from "libs/utils/image-picker";
import imageResizer from "libs/utils/image-resizer";
import { runInAction } from "mobx";
import { MutableRefObject, useEffect } from "react";
import { Dimensions } from "react-native";
import { ICamera } from ".";
import libsStorage from "../libsStorage";
import { ICameraView } from "./CameraView";

export const generateCamera = (props: ICamera, meta: any) => {
  const {
    value,
    styles,
    cameraView,
    placeholder,
    onChangeValue,
    onChange,
    onBlur,
    renderPreview,
  } = props;

  let source = undefined;
  if (!!value && typeof value === "string") {
    source = {
      uri: value,
    };
  }

  const dim = Dimensions.get("window");
  const ratio = libsStorage.camera.ratio.split(":"),
    width = dim.width,
    height = dim.width * (Number(ratio[0]) / Number(ratio[1]));

  const setSource = async (uri: string) => {
    if (!!onChangeValue) {
      onChangeValue(uri);
    }
    if (!!onChange) {
      const res = await onChange(uri);
      if (!!res && typeof res === "string" && !!onChangeValue) {
        onChangeValue(res);
      }
    }
    if (!!onBlur) {
      onBlur();
    }
  };

  const clearSource = () => {
    setSource("");
  };

  const switchCameraView = () => {
    runInAction(() => {
      meta.visbleCameraView = !meta.visbleCameraView;
    });
  };

  return {
    styles,
    value,
    source,
    width,
    height,
    cameraView,
    placeholder,
    setSource,
    clearSource,
    switchCameraView,
    renderPreview,
  };
};

export const generateCameraView = (
  props: ICameraView,
  meta: any,
  camViewRef: MutableRefObject<any>
) => {
  const {
    option,
    withCompress,
    cameraRef,
    visible,
    disableImagePicker,
    source,
    setSource,
    setVisible,
  } = props;
  const ref = !!cameraRef ? cameraRef : camViewRef;
  const dim = Dimensions.get("window");

  // Camera Ratio
  const ratio = libsStorage.camera.ratio;
  const arrratio = ratio.split(":"),
    width = dim.width,
    height = dim.width * (Number(arrratio[0]) / Number(arrratio[1]));

  // Camera Props
  const cameraProps: any = { ...props, ...libsStorage.camera._json };
  if (!!cameraProps.cameraRef) delete cameraProps.cameraRef;
  if (!!cameraProps.visible) delete cameraProps.visible;
  if (!!cameraProps.setVisible) delete cameraProps.setVisible;
  if (!!cameraProps.source) delete cameraProps.source;
  if (!!cameraProps.setSource) delete cameraProps.setSource;
  if (!!cameraProps.option) delete cameraProps.option;
  if (!!cameraProps.withCompress) delete cameraProps.withCompress;
  if (!!cameraProps.disableImagePicker) delete cameraProps.disableImagePicker;

  // Request Permission
  const requestPermission = async () => {
    const { granted: camGranted } = await Camera.requestPermissionsAsync();
    const {
      granted: pickGranted,
    } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!camGranted || !pickGranted) {
      requestPermission();
    } else {
      if (!!camGranted && !libsStorage.hasCameraPermission) {
        runInAction(() => {
          libsStorage.hasCameraPermission = camGranted;
        });
      }
      if (!!pickGranted && !libsStorage.hasImagePickPermission) {
        runInAction(() => {
          libsStorage.hasImagePickPermission = pickGranted;
        });
      }
    }
  };

  const onDismiss = () => {
    if (!!setVisible) {
      setVisible(visible);
    }
  };

  // Save
  const onSave = () => {
    if (!!setSource) {
      setSource(meta.tempURI);
    }
    onDismiss();
  };

  useEffect(() => {
    if (meta.tempURI !== source && typeof source === "string") {
      runInAction(() => (meta.tempURI = source));
    }
  }, []);

  return {
    width,
    height,
    cameraProps,
    meta,
    camera: ref,
    option,
    withCompress,
    disableImagePicker: !!disableImagePicker,
    requestPermission,
    onDismiss,
    onSave,
  };
};

export const generateTools = () => {
  // Flash
  const flashMode = libsStorage.camera.flashMode;
  const switchFlashMode = () => {
    let flashMode = libsStorage.camera.flashMode;
    if (flashMode === "auto") {
      flashMode = "on";
    } else if (flashMode === "on") {
      flashMode = "off";
    } else {
      flashMode = "auto";
    }
    runInAction(() => {
      libsStorage.camera.flashMode = flashMode;
    });
  };

  // Camera Type
  const switchType = () => {
    let type = libsStorage.camera.type;
    if (type === Camera.Constants.Type.front) {
      type = Camera.Constants.Type.back;
    } else {
      type = Camera.Constants.Type.front;
    }
    runInAction(() => {
      libsStorage.camera.type = type;
    });
  };

  // Ratio
  const ratio = libsStorage.camera.ratio;
  const switchRatio = () => {
    let ratio = libsStorage.camera.ratio;
    if (ratio === "1:1") {
      ratio = "4:3";
    } else if (ratio === "4:3") {
      ratio = "16:9";
    } else {
      ratio = "1:1";
    }
    runInAction(() => {
      libsStorage.camera.ratio = ratio;
    });
  };

  return {
    ratio,
    flashMode,
    switchFlashMode,
    switchType,
    switchRatio,
  };
};

export const generateActions = (
  camera: MutableRefObject<any>,
  meta: any,
  option?: CameraPictureOptions,
  withCompress: boolean = false
) => {
  // Take a picture
  const actionSnap = () => {
    return new Promise((resolve, reject) => {
      try {
        if (!!camera && !!camera.current) {
          runInAction(() => (meta.loading = true));
          camera.current
            .takePictureAsync(
              Object.assign(
                {
                  quality: 0.8,
                  base64: false,
                },
                option
              )
            )
            .then(async (res: any) => {
              let uri = res.uri;
              if (withCompress == true) {
                await imageResizer({ uri })
                  .then((res) => {
                    uri = res;
                  })
                  .catch((e) => console.log(e));
              }
              runInAction(() => {
                meta.tempURI = uri;
                meta.loading = false;
              });
              resolve(uri);
            })
            .catch((e: any) => {
              let msg = e.message;
              if (!msg) {
                msg = "Failed to take a picture. Please try again.";
              }
              if (!!meta.loading) runInAction(() => (meta.loading = true));
              alert(msg);
              reject(null);
            });
        }
      } catch (error) {
        let msg = error.message;
        if (!msg) {
          msg = "Failed to take a picture. Please try again.";
        }
        if (!!meta.loading) runInAction(() => (meta.loading = true));
        alert(msg);
        reject(null);
      }
    });
  };

  // Reset Camera
  const actionReset = () => {
    if (!!meta.tempURI) {
      runInAction(() => (meta.tempURI = ""));
    }
  };

  // Pick Image Gallery
  const actionPick = async () => {
    let uri = await imagePicker();
    if (!!uri) {
      if (withCompress == true) {
        await imageResizer({ uri })
          .then((res) => {
            uri = res;
          })
          .catch((e) => console.log(e));
      }
      runInAction(() => {
        meta.tempURI = uri;
      });
    }
  };
  return {
    actionPick,
    actionSnap,
    actionReset,
  };
};
