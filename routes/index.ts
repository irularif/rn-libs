import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { DrawerNavigationConfig } from "@react-navigation/drawer/lib/typescript/src/types";
import {
  DefaultNavigatorOptions,
  DrawerRouterOptions,
  StackRouterOptions,
} from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import { StackNavigationConfig } from "@react-navigation/stack/lib/typescript/src/types";
import { ReactElement } from "react";
import { IIcon } from "../ui/Icon";

export type TStackProps = Partial<
  DefaultNavigatorOptions<StackNavigationOptions> &
    StackRouterOptions &
    StackNavigationConfig &
    DefaultNavigatorOptions<DrawerNavigationOptions> &
    DrawerRouterOptions &
    DrawerNavigationConfig
>;

export interface IRoute {
  name: string;
  title?: string;
  icon?: IIcon | ReactElement;
  component?: React.ComponentType<any>;
  roles: string[];
}

export * from "app/routes";
