import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import { observer, useLocalObservable } from "mobx-react";
import React, { ReactElement } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import Button from "../Button";
import Icon, { IIcon } from "../Icon";
import Text from "../Text";
import View from "../View";
import { generateCheckbox } from "./generator";

export interface IRenderIcon extends Partial<IIcon> {
  name?: string;
  selectedColor?: string;
  isChecked?: boolean;
}

export interface ICheckboxProps {
  isChecked: boolean;
  label: string;
}

export interface ICheckbox {
  label?: string;
  isChecked?: boolean;
  mode?: "default" | "tags";
  editable?: boolean;
  onChange?: (isChecked: boolean) => void;
  onChangeValue?: (value: boolean) => void;
  renderItem?: (props: ICheckboxProps) => ReactElement;
  styles?: {
    label?: TextStyle;
    choiceWrapper?: ViewStyle;
    item?: ViewStyle;
  };
}

export default observer((props: ICheckbox) => {
  const { mode, styles } = props;
  const Theme: ITheme = useTheme() as any;
  const meta = useLocalObservable(() => ({
    isChecked: false,
  }));
  const { isChecked, handleChange } = generateCheckbox(props, meta);

  const defStyle: ViewStyle = {
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 5,
    marginBottom: 5,
    justifyContent: "flex-start",
  };
  const tagStyle: ViewStyle = {
    paddingHorizontal: 5,
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: isChecked ? Theme.colors.primary : Theme.colors.card,
    alignSelf: "flex-start",
    marginRight: 10,
    borderWidth: 1,
    borderColor: isChecked ? Theme.colors.primary : Theme.colors.border,
  };
  const itemstyle = StyleSheet.flatten([
    defStyle,
    mode === "tags" && tagStyle,
    styles?.item,
  ]);

  return (
    <Button style={itemstyle} mode="clean" onPress={handleChange}>
      <RenderItemView {...props} isChecked={isChecked} meta={meta} />
    </Button>
  );
});

const RenderItemView = observer((props: any) => {
  const { mode, renderItem, styles, isChecked, label } = props;
  const Theme: ITheme = useTheme() as any;

  if (!!renderItem) {
    return renderItem({ isChecked, label });
  }

  const tagStyle: TextStyle = {
    color: isChecked ? Theme.colors.textLight : Theme.colors.text,
  };

  const cstyle: TextStyle = StyleSheet.flatten([
    {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    mode === "tags" && tagStyle,
    styles?.label,
  ]);
  return (
    <>
      {mode !== "tags" && <RenderIcon isChecked={isChecked} />}
      <Text style={cstyle}>{label}</Text>
    </>
  );
});

const RenderIcon = (props: IRenderIcon) => {
  const { size, color, selectedColor, isChecked } = props;
  const Theme: ITheme = useTheme() as any;
  const baseSize = 24;
  const iconSize = !!size ? size : baseSize;
  const borderWidth = (1 * iconSize) / baseSize;
  const bColor = !!color ? color : Theme.colors.text;
  const sColor = !!color ? selectedColor : Theme.colors.primary;
  const borderColor = !!isChecked ? sColor : bColor;
  const bg = !!isChecked ? sColor : "transparent";
  const iconColor = !!isChecked ? Theme.colors.card : bg;

  return (
    <View
      style={{
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderRadius: 4,
        backgroundColor: bg,
      }}
    >
      <Icon name="md-checkmark" {...props} size={iconSize} color={iconColor} />
    </View>
  );
};
