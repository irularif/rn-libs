import { useTheme } from "@react-navigation/native";
import { ITheme } from "libs/config/theme";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";
import { StyleSheet, TextStyle } from "react-native";
import TextInput from "../TextInput";
import View from "../View";

export interface IOTP {
  length: number;
  value: any;
  onChange?: (value: string) => void;
}

export default observer((props: IOTP) => {
  const { value, onChange, length } = props;
  const meta = useLocalObservable(() => ({
    otp: Array(length).fill("") as any[],
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
  }, [value]);

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      {meta.otp.map((_, key) => (
        <Input
          key={key}
          index={key}
          inputRef={inputRef}
          onChange={onChange}
          meta={meta}
        />
      ))}
    </View>
  );
});

const Input = observer((props: any) => {
  const { index: key, inputRef, onChange, meta } = props;
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
      inputRef[index + 1].focus();
    }
    if (index === inputRef.length - 1) {
      inputRef[index].blur();
    }
    const otp = [...meta.otp];
    otp[index] = value;
    runInAction(() => (meta.otp = otp));
    if (!!onChange) {
      onChange(otp.join(""));
    }
  };

  return (
    <>
      <TextInput
        key={key}
        value={meta.otp[key]}
        inputRef={(ref: any) => (inputRef[key] = ref)}
        type="text"
        keyboardType="number-pad"
        onChangeValue={(v) => focusNext(key, v)}
        onKeyPress={(e) => focusPrevious(e.nativeEvent.key, key)}
        style={cstyleInput}
        maxLength={1}
      />
      {key < meta.otp.length - 1 && (
        <View
          key={key + "a"}
          style={{
            width: 5,
          }}
        />
      )}
    </>
  );
});
