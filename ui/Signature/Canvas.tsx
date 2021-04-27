import { observer, useLocalObservable } from "mobx-react";
import React, { MutableRefObject, useRef } from "react";
import Modal from "../Modal";
import { generateCanvasView } from "./generator";
import View from "../View";
import { Dimensions } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import useTheme from "libs/hooks/useTheme";
import Button from "../Button";
import Icon from "../Icon";
import Image from "../Image";
import { FileSystem } from "react-native-unimodules";

type ImageType = "image/jpeg" | "image/svg+xml";

type DataURL = "Base64";

export type SignatureViewProps = {
  webStyle?: string;
  onOK?: (signature: string) => void;
  onEmpty?: () => void;
  onClear?: () => void;
  onBegin?: () => void;
  onEnd?: () => void;
  descriptionText?: string;
  clearText?: string;
  confirmText?: string;
  customHtml?: string | null | undefined;
  autoClear?: boolean;
  trimWhitespace?: boolean;
  rotated?: boolean;
  imageType?: ImageType;
  dataURL?: DataURL;
  penColor?: string;
  backgroundColor?: string;
  dotSize?: number;
  minWidth?: number;
  androidHardwareAccelerationDisabled?: boolean;
};

export interface ICanvas extends SignatureViewProps {
  canvasRef?: MutableRefObject<any>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  source: string;
  setSource: (uri: string) => void;
}

export default observer((props: ICanvas) => {
  const { visible } = props;
  const dim = Dimensions.get("window");
  const signatureRef = useRef(null);
  const meta = useLocalObservable(() => ({
    tempURI: "",
    dataURI: "",
    loading: false,
  }));
  const cprops = generateCanvasView(props, meta, signatureRef);

  return (
    <Modal
      visible={visible}
      onDismiss={cprops.onDismiss}
      onRequestClose={cprops.onDismiss}
    >
      <View
        style={{
          backgroundColor: "#fff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: dim.width,
        }}
      >
        <SignatureView {...cprops} />
        <ActionGroupBottom {...cprops} />
      </View>
    </Modal>
  );
});

const SignatureView = observer((props: any) => {
  const { width, height, meta, signatureRef, signatureProps } = props;
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

  console.log(signatureProps);

  return (
    <SignatureScreen
      ref={signatureRef}
      autoClear={false}
      trimWhitespace={false}
      backgroundColor="#ffffff"
      imageType="image/jpeg"
      webStyle={`
          .m-signature-pad--footer {
            display: none;
          }
          .m-signature-pad {
            border: 0;
            box-shadow: none;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            position: absolute;
            height: 100%;
            width: 100%;
            margin-left: 0;
            margin-top: 0;
          }
          `}
      {...signatureProps}
      dataURL={meta.dataURI}
      onOK={props.onOk}
      onEnd={props.onEnd}
    />
  );
});

const ActionGroupBottom = observer((props: any) => {
  const { meta, onSave, actionSnap, actionReset } = props;
  const Theme = useTheme();

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
        <ActionSnap
          actionSnap={actionSnap}
          actionReset={actionReset}
          meta={meta}
        />
        <ActionSave onSave={onSave} meta={meta} />
      </View>
    </View>
  );
});

const ActionSnap = observer(({ actionReset, meta }: any) => {
  const Theme = useTheme();

  return (
    <Button
      mode="clean"
      style={{
        paddingVertical: 0,
        paddingHorizontal: 5,
        margin: 0,
      }}
      onPress={actionReset}
      disabled={!meta.dataURI && !meta.tempURI}
    >
      <Icon name="md-refresh" color={Theme.colors.text} size={30} />
    </Button>
  );
});

const ActionSave = observer(({ onSave, meta }: any) => {
  const Theme = useTheme();

  if (!meta.dataURI) return null;

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
      disabled={!meta.dataURI}
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
