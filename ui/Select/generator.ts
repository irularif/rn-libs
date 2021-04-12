import fuzzyMatch from "../../utils/fuzzy-match";
import { runInAction } from "mobx";
import { ICSelect, ISelect } from ".";

export const generateSelect = (props: ISelect, meta: any): ICSelect => {
  const {
    placeholder,
    items,
    value,
    valuePath,
    labelPath,
    styles,
    style,
    manualSearch,
    editable,
    onSearch,
    renderItem,
    renderLabel,
    onChangeValue,
    onChange,
    onBlur,
  } = props;

  const getSelected = (item: any) => {
    let isSelected = false;
    if (typeof item === "object") {
      let k = Object.keys(item);
      if (k.length > 0) {
        isSelected = item[k[0]] == value;
      }
      if (!!valuePath) {
        isSelected = item[valuePath] == value;
      }
    } else if (typeof item === "string" || typeof item === "number") {
      isSelected = item == value;
    }
    return isSelected;
  };
  const item = items.find(getSelected);
  const getLabel = (item: any, defaultValue: string = ""): string => {
    let label = defaultValue;
    if (typeof item === "object") {
      let k = Object.keys(item);
      if (k.length > 0) {
        label = item[k[0]];
      }
      if (!!valuePath) {
        label = item[valuePath] || label;
      }
      if (!!labelPath && item[labelPath]) {
        label = item[labelPath];
      }
    } else if (typeof item === "string" || typeof item === "number") {
      label = String(item);
    }
    return label;
  };
  let label = getLabel(item, placeholder);

  const switchSelect = () => {
    runInAction(() => (meta.visible = !meta.visible));
    if (!!onBlur) onBlur();
  };

  const setSearch = (value: string) => {
    runInAction(() => (meta.search = value));
    if (manualSearch && onSearch) {
      onSearch(meta.search);
    }
  };

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
      onChange({ item, index, items, selected: nvalue });
    }

    switchSelect();
  };

  const onFilter = (item: any) => {
    let match = true;
    let search = meta.search;
    if (!!search) {
      if (!!onSearch) {
        const res = onSearch(search, item);
        if (typeof res === "boolean") {
          match = res;
        }
      } else if (typeof item === "object") {
        let k = Object.keys(item);
        let f1 = true,
          f2 = true;
        if (k.length > 0) {
          f1 = fuzzyMatch(
            String(item[k[0]]).toLocaleLowerCase(),
            search.toLocaleLowerCase()
          );
        }
        if (!!valuePath) {
          f1 = fuzzyMatch(
            String(item[valuePath]).toLocaleLowerCase(),
            search.toLocaleLowerCase()
          );
        }
        if (!!labelPath) {
          f2 = fuzzyMatch(
            String(item[labelPath]).toLocaleLowerCase(),
            search.toLocaleLowerCase()
          );
        }
        match = f1 || f2;
      } else if (typeof item === "string" || typeof item === "number") {
        match = fuzzyMatch(
          String(item).toLocaleLowerCase(),
          search.toLocaleLowerCase()
        );
      }
    }
    return match;
  };

  return {
    label,
    items,
    selected: item,
    value,
    style,
    styles,
    manualSearch,
    placeholder,
    editable,
    renderLabel,
    onFilter,
    getLabel,
    getSelected,
    renderItem,
    switchSelect,
    handleChange,
    setSearch,
  };
};
