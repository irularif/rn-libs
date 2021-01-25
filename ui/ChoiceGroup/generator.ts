import { IRenderItem } from ".";

export const generateChoiceGroup = (props: IRenderItem) => {
  const {
    value,
    items,
    item,
    valuePath,
    labelPath,
    onChangeValue,
    onChange,
  } = props;
  const handleChange = (item: any, index: number) => {
    let nvalue = "";
    if (typeof item === "object") {
      let k = Object.keys(item);
      if (k.length > 0) {
        nvalue = item[k[0]];
      }
      if (!!valuePath) {
        nvalue = item[valuePath];
      }
    } else if (typeof item === "number" || typeof item === "string") {
      nvalue = String(item);
    }

    if (!!onChangeValue) {
      onChangeValue(nvalue);
    }

    if (!!onChange) {
      onChange({ item, index, items, isSelected: true, selected: nvalue });
    }
  };

  let isSelected = false;
  let label = "";
  if (typeof item === "object") {
    let k = Object.keys(item);
    if (k.length > 0) {
      label = item[k[0]];
      isSelected = item[k[0]] == value;
    }
    if (!!valuePath) {
      isSelected = item[valuePath] == value;
      label = item[valuePath] || label;
    }
    if (!!labelPath && item[labelPath]) {
      label = item[labelPath];
    }
  } else if (typeof item === "string" || typeof item === "number") {
    isSelected = item == value;
    label = String(item);
  }

  return {
    handleChange,
    isSelected,
    label,
  };
};
