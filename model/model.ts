import AsyncStorage from "@react-native-async-storage/async-storage";
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

export interface ModelOptions {
  localStorage?: boolean;
  storageName?: string;
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
    autorun(() => {
      obj.saveToLocalStorage(obj._json);
    });

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

    makeObservable(this, obj, {
      deep: true,
    });

    if (!!this._options?.localStorage) {
      // children model will be loaded from it's parent
      // so, we load only the parent
      // and it will extract it's value to it's children.
      await this.loadFromLocalStorage();
    }
  }

  get _json() {
    const result: any = {};
    const self: any = this;
    const except = Object.getOwnPropertyNames(Object.getPrototypeOf(self));

    for (let i of Object.getOwnPropertyNames(self)) {
      if (except.indexOf(i) > -1) {
        continue;
      }
      if (
        i !== "constructor" &&
        i.indexOf("_") !== 0 &&
        typeof self[i] !== "function"
      ) {
        if (self[i] instanceof Model) {
          if (self[i].constructor === this.constructor) {
            return JSON.stringify(self[i]);
          }
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
            result[i] = toJS(res);
          } else {
            result[i] = toJS(self[i]);
          }
        } else {
          result[i] = self[i];
        }
      }
    }
    return result;
  }

  _loadJSON(value: any, mapping?: any) {
    const except = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    const applyValue = (
      key: string,
      value: any,
      processValue?: (newValue: any, oldValue: any) => any
    ) => {
      if (typeof processValue === "function") {
        return processValue(value, (this as any)[key]);
      }
      return value;
    };

    let i: any;
    try {
      for (i in value) {
        let key: keyof Model = i as any;
        let valueMeta: any = undefined;
        if (except.indexOf(key) > -1 || i.indexOf("_") === 0) {
          continue;
        }

        if (mapping) {
          if (mapping[i]) {
            if (Array.isArray(mapping[i])) {
              if (mapping[i].length === 2) {
                key = mapping[i][0];
                valueMeta = mapping[i][1];
              }
            } else {
              key = mapping[i];
            }
          } else if ((this as any)[i] === undefined) {
            continue;
          }
        }

        if (typeof this[key] !== "object") {
          runInAction(() => {
            (this as any)[key] = applyValue(key, value[i], valueMeta);
          });
        } else {
          if (
            this[key] instanceof Array &&
            Array.isArray(this._arrClass[key])
          ) {
            valueMeta = (newVal: Array<any>, oldVal: Array<any>) => {
              let model = this._arrClass[key][0];
              let parent = this._arrClass[key][1];

              return newVal.map((x) => {
                let y = new model();
                y._initMobx(y);
                y._parent = parent;
                y._loadJSON(x);
                return y;
              });
            };
            runInAction(() => {
              (this as any)[key] = applyValue(key, value[i], valueMeta);
            });
          } else if (this[key] instanceof Model) {
            this[key]._loadJSON(applyValue(key, value[i], valueMeta));
          } else if (typeof value[i] !== "function") {
            runInAction(() => {
              (this as any)[key] = applyValue(key, value[i], valueMeta);
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return this;
  }

  private async loadFromLocalStorage() {
    let storeName = this._options.storageName || this.constructor.name;

    let data = await AsyncStorage.getItem(storeName);
    let dataStr: any = !!data ? data : "{}";

    try {
      const content = JSON.parse(dataStr);
      this._loadJSON(content);
    } catch (e) {}
  }

  private saveToLocalStorage = debounce(
    (obj) => {
      let storeName = this._options.storageName || this.constructor.name;
      let str = JSON.stringify(obj);
      AsyncStorage.setItem(storeName, str);
    },
    500,
    { trailing: true }
  );
}

const getType = (obj: any) => {
  if (!!obj && typeof obj === "object") {
    return obj.constructor.name;
  }
  return undefined;
};
