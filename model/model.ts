import debounce from "lodash.debounce";
import {
  action,
  autorun,
  computed,
  isObservable,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from "mobx";
import * as JSLZString from "lz-string";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decrypt, encrypt, generateKey } from "../utils/encrypt-aes";

export interface ModelOptions {
  localStorage?: boolean;
  storageName?: string;
  encrypt?: boolean;
  secretKey?: string;
}

class ArrayModel<T> extends Array<T> {
  private _model: any;
  private _parent: any;

  constructor(model?: any, parent?: any) {
    super();
    this._model = model;
    this._parent = parent;
  }
}

export abstract class Model {
  private _init: boolean = false;
  private _options: ModelOptions = {};
  private _arrClass: any = {};
  public _parent?: Model;

  public static create<T extends Model>(
    this: { new (): T },
    options?: ModelOptions
  ) {
    const obj: T = new this();
    if (options) {
      obj._options = options;
    }
    obj._initMobx(obj);

    return obj;
  }
  public static childOf<T extends Model>(this: { new (): T }, parent: Model) {
    const obj: T = new this();
    obj._parent = parent;

    return obj;
  }

  public static hasMany<T extends Model>(this: { new (): T }, parent: Model) {
    const c = this;
    const arr: T[] = new ArrayModel<T>(c, parent);

    return arr;
  }

  private async _initMobx(self: Model) {
    if (self._init) return;
    self._init = true;

    const obj = {} as any;

    for (let i of Object.getOwnPropertyNames(self)) {
      if (i.indexOf("_") === 0) continue;

      const val = (self as any)[i];
      let isObservable = true;
      const type = getType(val);

      if (!!type) {
        if (type === "ArrayModel") {
          self._arrClass[i] = [val._model, val._parent];
        } else if (val instanceof Model) {
          val._initMobx(val);
          isObservable = false;
        }
      }

      if (isObservable) {
        obj[i] = observable;
      }
    }

    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(self));
    for (let i of methods) {
      if (i !== "constructor" && i.indexOf("_") !== 0) {
        if (typeof (self as any)[i] === "function") {
          obj[i] = action;
        } else {
          obj[i] = computed;
        }
      }
    }

    makeObservable(self, obj, {
      deep: false,
    });

    if (!!self._options?.localStorage) {
      // children model will be loaded from it's parent
      // so, we load only the parent
      // and it will extract it's value to it's children.

      await self._loadFromLocalStorage(self, self._options);

      autorun(() => {
        self._saveToLocalStorage(self._json, self._options);
      });
    }
  }

  get _json() {
    const result: any = {};
    const self: any = this;
    const except = Object.getOwnPropertyNames(Object.getPrototypeOf(self));

    for (let i of Object.getOwnPropertyNames(self)) {
      if (
        except.indexOf(i) > -1 ||
        i.indexOf("_") === 0 ||
        i === "constructor" ||
        typeof self[i] === "function"
      ) {
        continue;
      }

      if (self[i] instanceof Model) {
        result[i] = self[i]._json;
      } else if (typeof self[i] === "object") {
        if (Array.isArray(self[i])) {
          let res = self[i].map((x: any) => {
            if (x instanceof Model) {
              x = x._json;
            } else if (isObservable(x)) {
              x = toJS(x);
            }
            return x;
          });
          result[i] = res;
        } else {
          result[i] = toJS(self[i]);
        }
      } else {
        result[i] = self[i];
      }
    }
    return result;
  }

  _loadJSON(value: any, mapping?: any) {
    const self: any = this;
    const except = Object.getOwnPropertyNames(Object.getPrototypeOf(self));

    const applyValue = (
      selfKey: string,
      newValue: any,
      oldValue: any,
      processValue?: (newValue: any, oldValue: any, key?: string) => any
    ) => {
      if (!!processValue && typeof processValue === "function") {
        return processValue(newValue, oldValue, selfKey);
      }
      return parseValue(oldValue, newValue);
    };

    try {
      for (let selfKey in self) {
        let key = selfKey;
        let valueMeta: any = undefined;
        if (
          except.indexOf(key) > -1 ||
          selfKey.indexOf("_") === 0 ||
          selfKey === "constructor" ||
          typeof self[selfKey] === "function"
        ) {
          continue;
        }

        if (!!mapping) {
          if (mapping[selfKey]) {
            if (Array.isArray(mapping[selfKey])) {
              if (mapping[selfKey].length === 2) {
                key = mapping[selfKey][0];
                valueMeta = mapping[selfKey][1];
              }
            } else {
              key = mapping[selfKey];
            }
          }
        }

        if (value[key] === undefined) {
          continue;
        }

        if (typeof self[selfKey] !== "object") {
          runInAction(() => {
            self[selfKey] = applyValue(
              selfKey,
              value[key],
              self[selfKey],
              valueMeta
            );
          });
        } else {
          if (self[selfKey] instanceof Array) {
            if (Array.isArray(this._arrClass[selfKey])) {
              valueMeta = (newVal: Array<any>, _: any) => {
                let model = this._arrClass[selfKey][0];
                let parent = this._arrClass[selfKey][1];

                return newVal.map((item) => {
                  let newItem = model.create();
                  newItem._parent = parent;
                  if (item instanceof Model) {
                    newItem._loadJSON(item._json);
                  } else {
                    newItem._loadJSON(item);
                  }
                  return newItem;
                });
              };
            }
            if (!!value[key] && !!self[selfKey].replace) {
              runInAction(() =>
                self[selfKey].replace(
                  applyValue(selfKey, value[key], self[selfKey], valueMeta)
                )
              );
            }
          } else if (self[selfKey] instanceof Model) {
            self[selfKey]._loadJSON(
              applyValue(selfKey, value[key], self[selfKey], valueMeta)
            );
            if (!self[selfKey]._parent) {
              self[selfKey]._parent = self;
            }
          } else {
            runInAction(() => {
              self[selfKey] = applyValue(
                selfKey,
                value[key],
                self[selfKey],
                valueMeta
              );
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return this;
  }

  private async _loadFromLocalStorage(self: any, options: ModelOptions) {
    try {
      const key = await generateKey(options?.secretKey);
      let storeName = options?.storageName;
      let dataStr: any = "";
      if (!!storeName) {
        dataStr = await AsyncStorage.getItem(storeName);
      } else {
        Error("Storage Name is required for saving to local storage");
      }
      dataStr = !!dataStr ? JSLZString.decompressFromBase64(dataStr) : "";
      let content: any = dataStr;
      if (!!options.encrypt && !!content) {
        content = await decrypt(JSON.parse(content), key);
      }
      if (!!content) {
        self._loadJSON(JSON.parse(content));
      }
    } catch (e) {
      console.log(e);
    }
  }

  private _saveToLocalStorage = debounce(
    async (obj: string, options: ModelOptions) => {
      try {
        const key = await generateKey(options?.secretKey);
        let storeName = options?.storageName;
        let str = JSON.stringify(obj);
        if (!!options?.encrypt) {
          let encryptedData = await encrypt(str, key);
          str = JSON.stringify(encryptedData);
        }
        str = JSLZString.compressToBase64(str);
        if (!!storeName) {
          AsyncStorage.setItem(storeName, str);
        } else {
          Error("Storage Name is required for saving to local storage");
        }
      } catch (e) {
        console.log(e);
      }
    },
    500,
    { trailing: true }
  );
}

const getType = (obj: any) => {
  if (!!obj && typeof obj === "object") {
    if (obj instanceof Model) {
      return "Model";
    } else if (obj instanceof ArrayModel) {
      return "ArrayModel";
    }
  }
  return undefined;
};

const isNull = (val: any) => {
  return val === null || val === undefined;
};

const parseValue = (oval: any, nval: any) => {
  if (!isNull(oval)) {
    switch (typeof oval) {
      case "number":
        return !isNull(nval) ? Number(nval) : nval;
      case "boolean":
        return !isNull(nval) ? Boolean(nval) : nval;
      case "string":
        if (!isNull(nval) && typeof nval === "object")
          return JSON.stringify(nval);
        return !isNull(nval) ? String(nval) : nval;
      case "object":
        if (!isNull(nval) && typeof nval === "string") return JSON.parse(nval);
        return nval;
      default:
        return nval;
    }
  } else {
    return !isNull(nval) ? nval : oval;
  }
};
