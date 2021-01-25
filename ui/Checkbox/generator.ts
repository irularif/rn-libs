import { runInAction } from "mobx";
import { ICheckbox } from ".";

export const generateCheckbox = (props: ICheckbox, meta: any) => {
  const { isChecked: value, label, onChange, onChangeValue } = props;
  const isChecked = meta.isChecked;

  if (value === true || value === false) {
    runInAction(() => (meta.isChecked = value));
  }

  const handleChange = () => {
    const isChecked = !meta.isChecked;
    if (!!onChangeValue) {
      onChangeValue(isChecked);
    }
    if (!!onChange) {
      onChange(isChecked);
    }
    runInAction(() => (meta.isChecked = isChecked));
  };

  return {
    handleChange,
    isChecked,
    label,
  };
};
