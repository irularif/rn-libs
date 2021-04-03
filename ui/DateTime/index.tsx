import { useTheme } from "@react-navigation/native";
import { observer, useLocalObservable } from "mobx-react";
import React, { ReactElement } from "react";
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
  Label?: (props: any) => ReactElement;
}

export default observer((props: IDateTime) => {
  const meta = useLocalObservable(() => ({
    visible: false,
  }));

  const cprops: any = generateDate(props, meta);
  const cstyle = StyleSheet.flatten([
    {
      paddingHorizontal: 5,
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    cprops?.styles?.wraper,
  ]);

  return (
    <>
      <Button mode="clean" onPress={cprops?.switchCalendar} style={cstyle}>
        <DateLabel {...cprops} meta={meta} />
      </Button>
      <DateTimeView {...cprops.dateProps} />
    </>
  );
});

const DateLabel = observer((props: any) => {
  const { label, value, iconProps, styles, Label } = props;
  const Theme: ITheme = useTheme() as any;
  const labelStyle = StyleSheet.flatten([
    {
      flexGrow: 1,
    },
    styles?.label,
  ]);

  if (!!Label) {
    return Label({ label, value });
  }

  return (
    <>
      <Text style={labelStyle}>{label}</Text>
      <Icon name="md-calendar" color={Theme.colors.text} {...iconProps} />
    </>
  );
});
