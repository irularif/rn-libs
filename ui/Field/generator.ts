import get from "lodash.get";
import { useEffect } from "react";
import { IField } from ".";

export const generateInput = (props: IField) => {
  const {
    path,
    value: ovValue,
    initializeField,
    children,
    label,
    editable,
    onChange,
    onBlur,
    setValue: overideValue,
  } = props;
  const setValue = (v: any) => {
    let value = v;
    if (!!overideValue) {
      let nv = overideValue(v);
      if (!!nv) {
        value = nv;
      }
    }
    if (typeof initializeField?.onChangeValue === "function") {
      initializeField.onChangeValue(path, value);
    }
    if (!!onChange) {
      onChange(value);
    }
  };
  const setBlur = () => {
    if (typeof initializeField?.onBlur === "function") {
      initializeField.onBlur(path);
    }
    if (!!onBlur) {
      onBlur();
    }
  };
  let value: any = "";
  if (
    !!initializeField?.values &&
    !isNull(get(initializeField.values, path, ""))
  ) {
    value = get(initializeField.values, path, "");
  }
  if (!isNull(ovValue)) {
    value = ovValue;
  }
  const Input = { ...children };
  const inputProps = {
    label,
    editable,
    ...children.props,
    onChangeValue: setValue,
    value,
    onBlur: setBlur,
  };

  useEffect(() => {
    if (typeof initializeField?.setLabel === "function") {
      initializeField.setLabel(path, label);
    }
  }, []);

  Input.props = inputProps;
  return Input;
};

const isNull = (val: any) => {
  return val === null || val === undefined;
};
