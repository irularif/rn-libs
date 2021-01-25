import { isValid } from "date-fns";
import set from "lodash.set";
import { runInAction, toJS } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import React, { ReactElement, useEffect } from "react";
import { ViewStyle } from "react-native";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import Button from "../Button";
import Text from "../Text";
import View, { IViewProps } from "../View";
import isplainobject from "lodash.isplainobject";
import get from "lodash.get";
import Fonts from "libs/assets/fonts";
import { useTheme } from "@react-navigation/native";
import { ITheme } from "libs/config/theme";

export interface IError {
  [k: string]: string;
}

export interface ISubmit {
  values: any;
  canSubmit: boolean;
}

export interface IField {
  onChangeValue?: (path: string, value: any) => void;
  onBlur?: (path: string) => void;
  onSubmit?: (params?: ISubmit) => void;
  values: any;
  meta: {
    errors: {
      [k: string]: string;
    };
    touched: {
      [k: string]: boolean;
    };
  };
}

export interface IFromProps {
  values?: any;
  validationSchema?: ObjectShape;
  validation?: (values: any) => IError;
  children: (props: IField) => void;
  onChange?: (path: string, value: any) => void;
  onSubmit?: (values: any, canSubmit?: boolean) => void;
  onError?: (fields: IError) => void;
  Submit?: (handleSubmit: any, canSubmit?: boolean) => ReactElement;
  hiddenSubmit?: boolean;
}

export default observer((props: IFromProps) => {
  const {
    children,
    values,
    onSubmit,
    onError,
    onChange,
    Submit,
    validation,
    validationSchema,
    hiddenSubmit,
  } = props;
  const meta = useLocalObservable(() => ({
    errors: {} as any,
    touched: {} as any,
    canSubmit: false,
  }));

  const setBlur = (path: string) => {
    if (!meta.touched[path]) {
      validate();
      runInAction(() => (meta.touched[path] = true));
    }
  };

  const setValue = async (path: string, value: any) => {
    if (typeof onChange == "function") {
      onChange(path, value);
    } else {
      runInAction(() => {
        set(values, path, value);
      });
    }
    validate();
  };

  const handleSubmit = () => {
    validate();
    if (!!onError) {
      onError(meta.errors);
    }
    if (!!onSubmit) {
      onSubmit(values, meta.canSubmit);
    }
  };

  const state: IField = {
    onChangeValue: setValue,
    onBlur: setBlur,
    onSubmit: handleSubmit,
    values: values,
    meta,
  };

  const validate = async () => {
    let err = {};
    if (!!validationSchema) {
      const validateData = prepareDataForValidation(values);
      await Yup.object()
        .shape(validationSchema)
        .validate(validateData, {
          abortEarly: false,
        })
        .catch((e) => {
          if (e.name === "ValidationError") {
            err = yupToFormErrors(e);
          } else {
            // We throw any other errors
            console.warn(
              "Warning: An unhandled error was caught during validation in <Formik validationSchema />",
              err
            );
          }
        });
    } else if (!!validation) {
      err = validation(values);
    }
    runInAction(() => {
      meta.errors = err;
      meta.canSubmit = Object.keys(err).length === 0;
    });
  };

  useEffect(() => {
    validate();
  }, []);

  return (
    <>
      {children(state)}
      <RenderSubmit
        Submit={Submit}
        handleSubmit={handleSubmit}
        hiddenSubmit={hiddenSubmit}
        meta={meta}
      />
    </>
  );
});

const RenderSubmit = observer((props: any) => {
  const { Submit, handleSubmit, meta, hiddenSubmit } = props;
  const { colors }: ITheme = useTheme() as any;
  return (
    <>
      {!!Submit
        ? Submit(handleSubmit, meta.canSubmit)
        : !hiddenSubmit && (
            <Button
              style={{
                margin: 0,
                marginTop: 15,
                paddingVertical: 12,
              }}
              onPress={handleSubmit}
              disabled={meta.canSubmit}
            >
              <Text
                style={{
                  color: colors.textLight,
                  fontSize: 16,
                  fontFamily: Fonts.Roboto,
                  fontWeight: "bold",
                }}
              >
                SAVE
              </Text>
            </Button>
          )}
    </>
  );
});

const prepareDataForValidation = (values: any) => {
  let data: any = Array.isArray(values) ? [] : {};

  for (let k in values) {
    if (Object.prototype.hasOwnProperty.call(values, k)) {
      let key = String(k);

      if (Array.isArray(values[key]) === true) {
        data[key] = values[key].map(function (value: any) {
          if (Array.isArray(value) === true || isplainobject(value)) {
            return prepareDataForValidation(value);
          } else {
            return value !== "" ? value : undefined;
          }
        });
      } else if (isplainobject(values[key])) {
        data[key] = prepareDataForValidation(values[key]);
      } else {
        data[key] = values[key] !== "" ? values[key] : undefined;
      }
    }
  }

  return data;
};

const yupToFormErrors = (yupError: any) => {
  let errors = {};

  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return set(errors, yupError.path, yupError.message);
    }

    for (
      let _isArray = Array.isArray(yupError.inner),
        _i: any = 0,
        _iterator = _isArray
          ? yupError.inner
          : yupError.inner[Symbol.iterator]();
      ;

    ) {
      let _ref5;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref5 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref5 = _i.value;
      }

      let err = _ref5;

      if (!get(errors, err.path)) {
        errors = set(errors, err.path, err.message);
      }
    }
  }

  return errors;
};
