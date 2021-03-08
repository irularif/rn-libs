import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import Button from "../Button";
import Icon from "../Icon";

export type IInputType =
  | "text"
  | "number"
  | "password"
  | "decimal"
  | "multiline"
  | "currency"
  | "email";

export interface ITextInput extends TextInputProps {
  type: IInputType;
  onChangeValue?: (value: string) => void;
  inputRef?: any;
}

export default observer((props: ITextInput) => {
  const { type, onChangeValue, style, editable, value, inputRef } = props;
  const [secure, setsecure] = useState(true);
  const originalType = useRef(type);
  const Theme: ITheme = useTheme() as any;
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
      default:
        v = text;
        break;
    }

    onChangeValue && onChangeValue(v);
  };

  const cprops = { ...props, onChangeText: setValue, ref: inputRef };
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
    case "decimal":
    case "number":
      ComponentProps = {
        keyboardType: "number-pad",
        ...ComponentProps,
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
        value: ComponentProps.value
          .toString()
          .replace(/,/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        keyboardType: "number-pad",
        ...ComponentProps,
      };
      break;
    case "email":
      ComponentProps = {
        keyboardType: "email-address",
        ...ComponentProps,
      };
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
