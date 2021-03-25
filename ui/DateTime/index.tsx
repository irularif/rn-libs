import { useTheme } from "@react-navigation/native";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { ITheme } from "../../config/theme";
import Button from "../Button";
import Icon, { IIcon } from "../Icon";
import Text from "../Text";
import DateTimeView from "./DateTimeView";
import { generateDate } from "./generator";
import { IDateTimeView } from "./DateTimeView";

export interface IDateTime {
  value?: string;
  format?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  labelFormat?: string;
  type?: "date" | "time" | "datetime" | "monthly" | "yearly";
  display?: "default" | "spinner" | "calendar" | "clock";
  editable?: boolean;
  onChange?: (ev: any, date: Date) => void;
  onChangeValue?: (value: string) => void;
  onBlur?: () => void;
  styles?: {
    label?: TextStyle;
    wraper?: ViewStyle;
  };
  iconProps?: Partial<IIcon>;
  dateProps?: IDateTimeView;
}

export default observer((props: IDateTime) => {
  const meta = useLocalObservable(() => ({
    visible: false,
  }));

  const cprops: any = generateDate(props, meta);

  return (
    <>
      <DateLabel {...cprops} meta={meta} />
      <DateTimeView {...cprops.dateProps} />
    </>
  );
});

const DateLabel = observer((props: any) => {
  const { label, switchCalendar, iconProps, styles } = props;
  const Theme: ITheme = useTheme() as any;
  const cstyle = StyleSheet.flatten([
    {
      paddingHorizontal: 5,
    },
    styles?.wraper,
  ]);
  const labelStyle = StyleSheet.flatten([
    {
      flexGrow: 1,
    },
    styles?.label,
  ]);

  return (
    <Button mode="clean" onPress={switchCalendar} style={cstyle}>
      <Text style={labelStyle}>{label}</Text>
      <Icon name="md-calendar" color={Theme.colors.text} {...iconProps} />
    </Button>
  );
});
