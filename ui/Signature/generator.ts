import { runInAction } from "mobx";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import { FileSystem } from "react-native-unimodules";
import { ISketchCanvas } from ".";
import libsStorage from "../libsStorage";
import { ICanvas } from "./Canvas";

export const generateSketchCanvas = (props: ISketchCanvas, meta: any) => {
  const {
    value,
    styles,
    canvasView,
    placeholder,
    prefixUri,
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
    if (value.indexOf("file://") === -1 && !!prefixUri) {
      source.uri = prefixUri + value;
    }
  }

  const dim = Dimensions.get("window");
  const width = dim.width,
    height = dim.height;

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
    canvasView,
    placeholder,
    setSource,
    clearSource,
    switchCameraView,
    renderPreview,
  };
};

export const generateCanvasView = (
  props: ICanvas,
  meta: any,
  signatureRef: any
) => {
  const { canvasRef, visible, source, setSource, setVisible } = props;
  if (!!canvasRef) {
    canvasRef.current = signatureRef.current;
  }

  const dim = Dimensions.get("window");
  const width = dim.width,
    height = dim.height;

  // Canvas Props
  const signatureProps: any = { ...props, ...libsStorage.camera._json };
  if (!!signatureProps.canvasRef) delete signatureProps.canvasRef;
  if (!!signatureProps.visible) delete signatureProps.visible;
  if (!!signatureProps.setVisible) delete signatureProps.setVisible;
  if (!!signatureProps.source) delete signatureProps.source;
  if (!!signatureProps.setSource) delete signatureProps.setSource;

  const onDismiss = () => {
    if (!!setVisible) {
      setVisible(visible);
    }
  };

  // Save
  const onSave = async () => {
    if (!!setSource) {
      const cachePath = FileSystem.cacheDirectory || "";
      const path = cachePath + new Date().getTime() + ".jpeg";
      FileSystem.writeAsStringAsync(
        path,
        meta.dataURI.replace("data:image/jpeg;base64,", ""),
        { encoding: FileSystem.EncodingType.Base64 }
      )
        .then((res) => {
          FileSystem.getInfoAsync(path, { size: true, md5: true }).then(
            (file) => {
              runInAction(() => {
                meta.tempURI = file.uri;
              });
              setSource(file.uri);
            }
          );
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
    onDismiss();
  };

  const onOk = (signature: any) => {
    runInAction(() => {
      meta.dataURI = signature;
    });
  };

  const onEnd = () => signatureRef.current.readSignature();

  const actionReset = () => {
    runInAction(() => {
      meta.dataURI = "";
      meta.tempURI = "";
    });
    signatureRef?.current?.clearSignature();
  };

  useEffect(() => {
    if (!!source && meta.tempURI !== source && typeof source === "string") {
      runInAction(() => (meta.tempURI = source));
    }
  }, [source]);

  return {
    width,
    height,
    signatureProps,
    meta,
    signatureRef,
    onDismiss,
    onSave,
    onOk,
    onEnd,
    actionReset,
  };
};
