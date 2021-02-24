import { useTheme } from "@react-navigation/native";
import { ITheme } from "../../config/theme";
import { observer, useLocalObservable } from "mobx-react";
import React, { ReactElement } from "react";
import { StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import Button from "../Button";
import Field from "../Field";
import FlatList from "../FlatList";
import Icon from "../Icon";
import Modal from "../Modal";
import TextInput from "../TextInput";
import TopBar from "../TopBar";
import View, { IViewProps } from "../View";
import { generateSelect } from "./generator";

export interface ICSelect extends Partial<ISelect> {
  items: any[];
  label?: string;
  selected?: any;
  switchSelect: () => void;
  handleChange: (item: any, index: number) => void;
  getLabel: (item: any, defaultValue?: string) => string;
  getSelected: (item: any) => boolean;
  setSearch: (value: string) => void;
  onFilter: (item: any) => boolean;
}

export interface IRenderItem {
  item: any;
  index: number;
  separators: any;
  cprops: any;
}

export interface IPropsItem {
  index: number;
  item: any;
  items: any[];
  selected: any;
}

export interface ISelect extends IViewProps {
  items: any[];
  placeholder?: string;
  value?: any;
  valuePath?: string;
  labelPath?: string;
  mode?: "default" | "tags";
  manualSearch?: boolean;
  onChange?: (props: IPropsItem) => void;
  onChangeValue?: (value: string) => void;
  onBlur?: () => void;
  renderItem?: (props: IPropsItem) => ReactElement;
  onSearch?: (search: string, item?: any) => boolean | void;
  style?: ViewStyle;
  styles?: {
    label?: TextStyle;
    choiceWrapper?: ViewStyle;
    item?: ViewStyle;
  };
}

export default observer((props: ISelect) => {
  const meta = useLocalObservable(() => ({
    visible: false,
    search: "",
  }));
  const cprops = generateSelect(props, meta);
  const { switchSelect, setSearch, placeholder } = cprops;
  const Theme: ITheme = useTheme() as any;

  return (
    <>
      <LabelSelect {...cprops} />
      <Modal
        visible={meta.visible}
        onRequestClose={switchSelect}
        style={{
          backgroundColor: Theme.colors.background,
        }}
      >
        <TopBar backButton actionBackButton={switchSelect}>
          <Field
            path=""
            label="Search"
            hiddenLabel
            value={meta.search}
            onChange={setSearch}
            style={{
              flex: 1,
              marginBottom: 0,
              marginRight: 10,
            }}
            Suffix={
              <Button
                style={{
                  backgroundColor: "transparent",
                  paddingHorizontal: 5,
                  paddingVertical: 0,
                  margin: 0,
                  borderRadius: 0,
                }}
                onPress={() => {
                  setSearch("");
                }}
              >
                <Icon name={"ios-close-circle"} color={Theme.colors.text} />
              </Button>
            }
          >
            <TextInput type="text" placeholder={placeholder} />
          </Field>
        </TopBar>
        <SelectView {...cprops} meta={meta} />
      </Modal>
    </>
  );
});

const LabelSelect = observer((props: any) => {
  const { label, switchSelect, styles, style } = props;
  const Theme: ITheme = useTheme() as any;
  const cStyle = StyleSheet.flatten([
    {
      paddingHorizontal: 0,
    },
    style,
    styles?.label,
  ]);
  const labelStyle = StyleSheet.flatten([
    {
      flex: 1,
    },
  ]);

  return (
    <Button mode="clean" onPress={switchSelect} style={cStyle}>
      <Text style={labelStyle}>{label}</Text>
      <Icon name="ios-arrow-down" color={Theme.colors.text} />
    </Button>
  );
});

const SelectView = observer((props: any) => {
  const { items, onFilter, manualSearch } = props;
  const cprops = props;
  const Theme: ITheme = useTheme() as any;
  let citems: any[] = items;
  if (!manualSearch) {
    citems = items.filter(onFilter);
  }

  return (
    <FlatList
      data={citems}
      keyExtractor={(_, index: number) => String(index)}
      renderItem={(state) => <RenderItem cprops={cprops} {...state} />}
      ItemSeparatorComponent={() => (
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: Theme.colors.border,
          }}
        />
      )}
    />
  );
});

const RenderItem = observer((props: IRenderItem) => {
  const { index, item, cprops } = props;
  const { handleChange, styles } = cprops;
  const Theme: ITheme = useTheme() as any;

  const defStyle: ViewStyle = {
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: "flex-start",
  };
  const itemstyle = StyleSheet.flatten([defStyle, styles?.item]);

  return (
    <Button
      style={itemstyle}
      mode="clean"
      onPress={() => handleChange(item, index)}
    >
      <RenderItemView {...props} />
    </Button>
  );
});

const RenderItemView = observer((props: IRenderItem) => {
  const { index, item, cprops } = props;
  const { value, items, renderItem, styles, getLabel, getSelected } = cprops;
  const label = getLabel(item);
  const Theme: ITheme = useTheme() as any;

  if (!!renderItem) {
    return renderItem({ item, index, items, selected: value });
  }

  const isSelected = getSelected(item);

  const selectedStyle: ViewStyle = {
    backgroundColor: Theme.colors.card,
    borderLeftWidth: 4,
    borderColor: Theme.colors.primary,
  };

  const cstyle = StyleSheet.flatten([
    {
      flex: 1,
      paddingHorizontal: 5,
      paddingVertical: 15,
    },
    styles?.label,
    isSelected && selectedStyle,
  ]);
  return (
    <View style={cstyle}>
      <Text>{label}</Text>
    </View>
  );
});
