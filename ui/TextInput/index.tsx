import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import { observer, useLocalObservable } from "mobx-react";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import { runInAction, toJS } from "mobx";
import { mask, unmask } from "../../utils/string-masking";

export type IInputType =
  | "text"
  | "number"
  | "password"
  | "decimal"
  | "multiline"
  | "currency"
  | "email"
  | "float"
  | "mask";

export interface ITextInput extends TextInputProps {
  type: IInputType;
  onChangeValue?: (value: string) => void;
  inputRef?: any;
  mask?: string;
}

export default observer((props: ITextInput) => {
  const {
    type,
    onChangeValue,
    style,
    editable,
    value,
    inputRef,
    mask: p,
  } = props;
  const [secure, setsecure] = useState(true);
  const originalType = useRef(type);
  const Theme: ITheme = useTheme() as any;
  const pattern = p;
  const inpLength = pattern?.replace(/[^_]/g, "").length;
  const meta = useLocalObservable(() => ({
    start: 0,
    end: 0,
  }));

  const setValue = (text: any) => {
    let v;
    switch (type || originalType.current) {
      case "number":
        let b = text.replace(/[^0-9]/g, "");
        v = b || "";
        break;
      case "decimal":
        let c = text.replace(/[^0-9]/g, "");
        v = parseInt(c || "0");
        break;
      case "currency":
        let a = text.replace(/[^0-9]/g, "");
        v = parseInt(a || "0");
        break;
      case "email":
        v = text.replace(/\s/g, "");
        break;
      case "float":
        v = text.replace(/[^0-9.,]/g, "");
        break;
      default:
        v = text;
        break;
    }

    onChangeValue && onChangeValue(v);
  };

  const onKeyPress = (e: any) => {
    const key = e.nativeEvent.key;
    let pos = meta.start;
    if (key === "Backspace") {
      pos -= 1;
    } else {
      pos += 1;
    }

    if (!!value && pos + 1 > value?.length) {
      pos = value?.length;
    } else {
      pos = pos;
    }

    setTimeout(() => {
      runInAction(() => {
        meta.start = pos;
        meta.end = pos;
      });
    }, 0);
  };

  const cprops = {
    ...props,
    onChangeText: setValue,
    onKeyPress,
    ref: inputRef,
  };
  const cstyle = StyleSheet.flatten([
    {
      flex: 1,
      backgroundColor: "transparent",
      color: Theme.colors.text,
      paddingVertical: 8,
      fontSize: Theme.fontSize.h6,
      fontFamily: Theme.fontStyle.regular,
      paddingHorizontal: 10,
    },
    {
      opacity: editable !== false ? 1 : 0.7,
    },
    style,
  ]);
  let ComponentProps: any = {
    returnKeyType: "next",
    ...cprops,
    style: cstyle,
    value: !!value ? String(value) : "",
  };

  let Component = TextInput;

  switch (type) {
    case "password":
      ComponentProps = {
        ...ComponentProps,
        secureTextEntry: secure,
      };
      break;
    case "float":
    case "decimal":
    case "number":
      ComponentProps = {
        keyboardType: "number-pad",
        ...ComponentProps,
        value: ComponentProps.value.toString(),
      };
      break;
    case "multiline":
      ComponentProps = {
        textAlignVertical: "top",
        numberOfLines: 4,
        ...ComponentProps,
        multiline: true,
        style: {
          ...ComponentProps.style,
          height: undefined,
          minHeight: 100,
        },
      };
      break;
    case "currency":
      ComponentProps = {
        ...ComponentProps,
        value: ComponentProps.value
          .toString()
          .replace(/,/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        keyboardType: "number-pad",
      };
      break;
    case "email":
      ComponentProps = {
        keyboardType: "email-address",
        ...ComponentProps,
      };
      break;
    case "mask":
      let v = !!pattern
        ? !!value
          ? mask(value, pattern).result
          : pattern
        : value;
      ComponentProps = {
        ...ComponentProps,
        value: v,
        selection: toJS(meta),
        max: pattern?.length,
      };
      console.log("asd", v);
      break;
  }
  return (
    <>
      <Component {...ComponentProps} />
      {type === "password" && (
        <Button
          style={{
            backgroundColor: "transparent",
            paddingHorizontal: 10,
            paddingVertical: 0,
            margin: 0,
            borderRadius: 0,
          }}
          onPress={() => {
            setsecure(!secure);
          }}
        >
          <Icon
            name={!!secure ? "ios-eye" : "ios-eye-off"}
            color={Theme.colors.text}
          />
        </Button>
      )}
    </>
  );
});

// Masking
// 0	Any numbers
// 9	Any numbers (Optional)
// #	Any numbers (recursive)
// A	Any alphanumeric character
// a	Any alphanumeric character (Optional) Not implemented yet
// S	Any letter
// U	Any letter (All lower case character will be mapped to uppercase)
// L	Any letter (All upper case character will be mapped to lowercase)
// $	Escape character, used to escape any of the special formatting characters.
