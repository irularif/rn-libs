import AppConfig from "app/config/app";

export type TMode = "production" | "staging" | "dev" | string;
export interface IAppConfig {
  mode: TMode;
  [key: string]: any;
}

export default AppConfig;
