import { dateFormat } from "libs/utils/date";
import { runInAction } from "mobx";
import { useEffect } from "react";
import { Platform } from "react-native";
import { IDateTime } from ".";
import { IDateTimeView } from "./DateTimeView";

export const generateDate = (props: IDateTime, meta: any) => {
  const {
    value,
    format,
    labelFormat,
    type,
    display,
    iconProps,
    styles,
    onBlur,
    onChangeValue,
    onChange,
  } = props;

  const v = !!value && typeof value === "string" ? new Date(value) : new Date();
  let labelF = labelFormat;
  let dateF = format;
  if (!labelF) {
    switch (type) {
      case "date":
        labelF = "dd MMMM yyyy";
        dateF = "yyyy-MM-dd";
        break;
      case "time":
        labelF = "HH:mm";
        dateF = "HH:mm:ss";
        break;
      case "datetime":
        labelF = "dd MMMM yyyy - HH:mm";
        dateF = "yyyy-MM-dd HH:mm:ss";
        break;
      case "monthly":
        labelF = "MMMM yyyy";
        dateF = "yyyy-MM";
        break;
      case "yearly":
        labelF = "yyyy";
        dateF = "yyyy";
        break;
    }
  }

  const label = dateFormat(v, labelF) || labelF;

  const handleChange = (ev: any, date: Date) => {
    if (!!onChangeValue) {
      onChangeValue(dateFormat(date, dateF));
    }
    if (!!onChange) {
      onChange(ev, date);
    }
    if (!!onBlur) {
      onBlur();
    }
  };

  const switchCalendar = () => {
    runInAction(() => (meta.visible = !meta.visible));
  };

  const dateProps = {
    display,
    mode: type,
    value: v,
    visible: meta.visible,
    onChange: handleChange,
    setVisible: switchCalendar,
  };

  return {
    label,
    dateProps,
    iconProps,
    styles,
    switchCalendar,
  };
};

export const generateDateView = (props: IDateTimeView, meta: any) => {
  const { onChange, setVisible, mode, value } = props;

  const handleChange = (ev: any, date: Date) => {
    if (Platform.OS === "android") {
      if (ev.type === "dismissed") {
        setVisible(!meta.visible);
        runInAction(() => {
          meta.tempValue = value;
          if (meta.mode === "time") {
            meta.mode = mode === "datetime" ? "date" : mode;
          }
        });
      } else {
        if (mode === "datetime") {
          if (meta.mode === "time") {
            runInAction(() => {
              meta.tempValue = date;
              meta.mode = "date";
            });
            setVisible(!meta.visible);
            if (!!onChange) {
              onChange(ev, date);
            }
          } else {
            runInAction(() => {
              meta.tempValue = date;
              meta.mode = "time";
            });
          }
        } else {
          setVisible(!meta.visible);
          runInAction(() => {
            meta.tempValue = date;
          });
          if (!!onChange) {
            onChange(ev, date);
          }
        }
      }
    } else {
      if (ev.type === "dismissed") {
        setVisible(!meta.visible);
        runInAction(() => {
          meta.tempValue = value;
        });
      } else {
        setVisible(!meta.visible);
        runInAction(() => {
          meta.tempValue = date;
        });
        if (!!onChange) {
          onChange(ev, date);
        }
      }
    }
  };

  useEffect(() => {
    runInAction(() => {
      if (meta.tempValue !== value) {
        meta.tempValue = value;
      }
      let m = mode;
      if (Platform.OS === "android" && mode === "datetime") {
        m = "date";
      }
      meta.mode = m;
    });
  }, [mode]);

  return {
    ...props,
    value: meta.tempValue,
    mode: meta.mode,
    onChange: handleChange,
  };
};
