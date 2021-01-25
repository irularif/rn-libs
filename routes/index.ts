import {
  DefaultNavigatorOptions,
  StackRouterOptions,
} from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import { StackNavigationConfig } from "@react-navigation/stack/lib/typescript/src/types";
import { ReactElement } from "react";
import { IIcon } from "../ui/Icon";

export type TStackProps = Partial<
  DefaultNavigatorOptions<StackNavigationOptions> &
    StackRouterOptions &
    StackNavigationConfig
>;

export interface IRoute {
  name: string;
  title?: string;
  icon?: IIcon | ReactElement;
  component?: React.ComponentType<any>;
  roles: string[];
}

export * from "app/routes";
