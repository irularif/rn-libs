import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";
import { StyleSheet, TextStyle } from "react-native";
import TextInput from "../TextInput";
import View from "../View";
import Text from "../Text";

export interface IOTP {
  length: number;
  value: any;
  onChange?: (value: string) => void;
  validation?: (value: string) => string | undefined;
}

export default observer((props: IOTP) => {
  const { value, onChange, length, validation } = props;
  const Theme: ITheme = useTheme() as any;
  const meta = useLocalObservable(() => ({
    otp: Array(length).fill("") as any[],
    errorMessage: "",
  }));
  const inputRef: any[] = [];

  useEffect(() => {
    if (!!value && meta.otp.join() !== value) {
      const otp = [...meta.otp];
      for (let i in otp) {
        otp[i] = value[i];
      }
      runInAction(() => (meta.otp = otp));
    }
    if (!!validation) {
      let m: any = validation(value);
      if (!!m) {
        runInAction(() => (meta.errorMessage = m));
      }
    }
  }, []);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Input inputRef={inputRef} onChange={onChange} meta={meta} />
      </View>
      <Error meta={meta} validation={validation} value={value} />
    </>
  );
});

const Error = observer((props: any) => {
  const Theme: ITheme = useTheme() as any;
  const { meta, validation, value } = props;
  if (!meta.errorMessage) return null;

  useEffect(() => {
    if (!!validation) {
      let m: any = validation(value);
      if (!!m) {
        runInAction(() => (meta.errorMessage = m));
      }
    }
  }, [value]);

  return (
    <Text
      style={{
        color: Theme.colors.notification,
        fontSize: 13,
        marginHorizontal: 5,
        marginTop: 4,
      }}
    >
      {meta.errorMessage}
    </Text>
  );
});

const Input = observer((props: any) => {
  const { inputRef, onChange, meta } = props;
  const Theme: ITheme = useTheme() as any;

  let baseStyle: TextStyle = {
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: "center",
    paddingHorizontal: 5,
    borderRadius: 4,
    textAlign: "center",
    fontFamily: Theme.fontStyle.bold,
    fontSize: Theme.fontSize.h2,
  };

  const cstyleInput = StyleSheet.flatten([baseStyle, Theme.styles.field]);

  const focusPrevious = (key: string, index: number) => {
    if (key === "Backspace" && index !== 0) inputRef[index - 1].focus();
  };

  const focusNext = (index: number, value: string) => {
    if (index < inputRef.length - 1 && value) {
      if (value.length > 1 && index + 2 <= inputRef.length - 1) {
        inputRef[index + 2].focus();
      } else {
        inputRef[index + 1].focus();
      }
    }
    if (index === inputRef.length - 1) {
      inputRef[index].blur();
    }
    const otp = [...meta.otp];
    otp[index] = value;
    const nvalue = otp.join("");
    for (let i in otp) {
      otp[i] = nvalue[i];
    }
    runInAction(() => (meta.otp = otp));
    if (!!onChange) {
      onChange(otp.join(""));
    }
  };

  return (
    <>
      {meta.otp.map((_: any, key: number) => (
        <TextInput
          key={key}
          value={meta.otp[key]}
          inputRef={(ref: any) => (inputRef[key] = ref)}
          type="text"
          keyboardType="number-pad"
          onChangeValue={(v) => focusNext(key, v)}
          onKeyPress={(e) => focusPrevious(e.nativeEvent.key, key)}
          style={StyleSheet.flatten([
            cstyleInput,
            {
              marginRight: key < meta.otp.length - 1 ? 5 : 0,
            },
          ])}
        />
      ))}
    </>
  );
});
