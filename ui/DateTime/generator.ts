import { dateFormat } from "../../utils/date";
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
    type = "date",
    display,
    iconProps,
    styles,
    minimumDate,
    maximumDate,
    onBlur,
    onChangeValue,
    onChange,
    Label,
  } = props;
  let v = null;
  if (!!value && typeof value === "string") {
    v = new Date(value);
  }

  let labelF = labelFormat;
  if (!labelF) {
    switch (type) {
      case "date":
        labelF = "dd MMMM yyyy";
        break;
      case "time":
        labelF = "HH:mm";
        break;
      case "datetime":
        labelF = "dd MMMM yyyy - HH:mm";
        break;
      case "monthly":
        labelF = "MMMM yyyy";
        break;
      case "yearly":
        labelF = "yyyy";
        break;
    }
  }

  let dateF = format;
  if (!dateF) {
    switch (type) {
      case "date":
        dateF = "yyyy-MM-dd";
        break;
      case "time":
        dateF = "HH:mm";
        break;
    }
  }

  let label = labelF;
  if (v instanceof Date) {
    label = dateFormat(v, labelF);
  }

  const handleChange = (ev: any, date: Date) => {
    if (!!onChangeValue) {
      let d = date.toJSON();
      if (dateF) {
        d = dateFormat(date, dateF);
      }
      onChangeValue(d);
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
    minimumDate,
    maximumDate,
    onChange: handleChange,
    setVisible: switchCalendar,
  };

  return {
    label,
    value: v,
    dateProps,
    iconProps,
    styles,
    switchCalendar,
    Label,
  };
};

export const generateDateView = (props: IDateTimeView, meta: any) => {
  const { onChange, setVisible, mode, value } = props;

  const handleChange = (ev: any, date: Date) => {
    if (Platform.OS === "android") {
      if (ev.type === "dismissed") {
        setVisible(!meta.visible);
        runInAction(() => {
          if (!!value) meta.tempValue = value;
          if (meta.mode === "time") {
            meta.mode = mode === "datetime" ? "date" : mode;
          }
        });
      } else {
        if (mode === "datetime") {
          if (meta.mode === "time") {
            setVisible(!meta.visible);
            runInAction(() => {
              meta.tempValue = date;
              meta.mode = "date";
            });
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
      if (meta.tempValue !== value && !!value) {
        meta.tempValue = value;
      }
      let m = mode;
      if (Platform.OS === "android" && mode === "datetime") {
        m = "date";
      }
      meta.mode = m;
    });
  }, []);

  return {
    ...props,
    value: meta.tempValue,
    mode: meta.mode,
    onChange: handleChange,
  };
};
