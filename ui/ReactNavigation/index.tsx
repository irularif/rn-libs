import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DarkTheme, DefaultTheme } from "../../config/theme";
import { IRoute, TStackProps } from "../../routes";
import { observer } from "mobx-react";
import React from "react";

interface IAppProvider {
  routes: IRoute[];
  initialStack: TStackProps;
  mode?: "default" | "dark";
  refReactNavigation?: any;
}

const Stack = createStackNavigator();

export default observer((props: IAppProvider) => {
  const { routes, initialStack, mode, refReactNavigation } = props;

  return (
    <NavigationContainer
      theme={mode === "dark" ? DarkTheme : DefaultTheme}
      ref={refReactNavigation}
    >
      <Stack.Navigator headerMode="none" {...initialStack}>
        {routes.map(
          (route: IRoute) =>
            !!route.component && (
              <Stack.Screen
                key={route.name}
                {...route}
                component={route.component}
              />
            )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
});
