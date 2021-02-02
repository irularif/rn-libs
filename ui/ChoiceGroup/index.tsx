import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import { observer } from "mobx-react";
import React, { ReactElement } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import Button from "../Button";
import Text from "../Text";
import View, { IViewProps } from "../View";
import { generateChoiceGroup } from "./generator";

export interface IRenderIcon {
  size?: number;
  color?: string;
  selectedColor?: string;
  isSelected?: boolean;
}

export interface IRenderItem extends IChoiceGroup {
  item: any;
  index: number;
}

export interface IPropsItem {
  index: number;
  item: any;
  items: any[];
  selected: any;
  isSelected: boolean;
}

export interface IOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface IChoiceGroup extends IViewProps {
  items: any[];
  value?: any;
  valuePath?: string;
  labelPath?: string;
  mode?: "default" | "tags";
  onChange?: (props: IPropsItem) => void;
  onChangeValue?: (value: string) => void;
  onBlur?: () => void;
  renderItem?: (props: IPropsItem) => ReactElement;
  style?: ViewStyle;
  styles?: {
    label?: TextStyle;
    choiceWrapper?: ViewStyle;
    item?: ViewStyle;
  };
}

export default observer((props: IChoiceGroup) => {
  const { items, mode, style, styles } = props;
  const tagWrapperStyle: ViewStyle = {
    flexWrap: "wrap",
    flexDirection: "row",
    alignSelf: "flex-start",
  };
  const cstyle = StyleSheet.flatten([
    mode === "tags" && tagWrapperStyle,
    styles?.choiceWrapper,
    style,
  ]);

  return (
    <View style={cstyle}>
      {items.map((item, index) => (
        <RenderItem key={index} {...props} index={index} item={item} />
      ))}
    </View>
  );
});

const RenderItem = observer((props: IRenderItem) => {
  const { index, item, mode, styles } = props;
  const Theme: ITheme = useTheme() as any;
  const { isSelected, handleChange } = generateChoiceGroup(props);

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
    backgroundColor: isSelected ? Theme.colors.primary : Theme.colors.card,
    alignSelf: "flex-start",
    marginRight: 10,
    borderWidth: 1,
    borderColor: isSelected ? Theme.colors.primary : Theme.colors.border,
  };
  const itemstyle = StyleSheet.flatten([
    defStyle,
    mode === "tags" && tagStyle,
    styles?.item,
  ]);

  return (
    <Button
      style={itemstyle}
      mode="clean"
      onPress={() => handleChange(item, index)}
    >
      <RenderItemView {...props} index={index} item={item} />
    </Button>
  );
});

const RenderItemView = observer((props: IRenderItem) => {
  const { index, item, value, items, mode, renderItem, styles } = props;
  const Theme: ITheme = useTheme() as any;
  const { isSelected, label } = generateChoiceGroup(props);

  if (!!renderItem) {
    return renderItem({ item, index, items, isSelected, selected: value });
  }

  const tagStyle: TextStyle = {
    color: isSelected ? Theme.colors.textLight : Theme.colors.text,
  };

  const cstyle = StyleSheet.flatten([
    {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    mode === "tags" && tagStyle,
    styles?.label,
  ]);
  return (
    <>
      {mode !== "tags" && <RenderIcon isSelected={isSelected} />}
      <Text style={cstyle}>{label}</Text>
    </>
  );
});

const RenderIcon = (props: IRenderIcon) => {
  const { size, color, selectedColor, isSelected } = props;
  const Theme: ITheme = useTheme() as any;
  const baseSize = 22;
  const iconSize = (!!size ? size : baseSize) / 2;
  const borderWidth = (1 * iconSize) / baseSize;
  const bColor = !!color ? color : Theme.colors.text;
  const sColor = !!color ? selectedColor : Theme.colors.primary;
  const borderColor = !!isSelected ? sColor : bColor;
  const bg = !!isSelected ? sColor : "transparent";

  return (
    <View
      style={{
        borderWidth: borderWidth,
        borderColor: borderColor,
        padding: 4,
        borderRadius: 99,
      }}
    >
      <View
        style={{
          width: iconSize,
          height: iconSize,
          backgroundColor: bg,
          borderRadius: 99,
        }}
      />
    </View>
  );
};
