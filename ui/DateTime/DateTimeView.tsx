import RNDateTimePicker, {
  AndroidNativeProps,
  IOSNativeProps,
} from "@react-native-community/datetimepicker";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { generateDateView } from "./generator";

export type IDateTimeView = Partial<IOSNativeProps | AndroidNativeProps> & {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  value: Date;
  onChange: (ev: any, date: Date) => void;
  mode?: "date" | "time" | "datetime" | "monthly" | "yearly";
};

export default observer((props: IDateTimeView) => {
  const { visible } = props;
  const meta = useLocalObservable(() => ({
    mode: "date",
    tempValue: new Date(),
  }));

  const cprops: any = generateDateView(props, meta);

  if (!visible) return null;
  return <RNDateTimePicker {...cprops} />;
});
