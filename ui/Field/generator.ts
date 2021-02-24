import get from "lodash.get";
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
  let value = "";
  if (!!initializeField?.values && !!get(initializeField.values, path, "")) {
    value = get(initializeField.values, path, "");
  }
  if (!!ovValue) {
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

  Input.props = inputProps;

  return Input;
};
