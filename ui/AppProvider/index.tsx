import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { loadAsync } from "expo-font";
import { DarkTheme, DefaultTheme } from "libs/config/theme";
import { IRoute, TStackProps } from "libs/routes";
import { observer } from "mobx-react";
import React, { ReactElement, ReactNode, useRef, useState } from "react";
import { sourceFonts } from "../../assets/fonts";
import permissions from "../../config/permissions";
import useAsyncEffect from "../../utils/use-async-effect";
import Loading from "./Loading";

interface IAppProvider {
  children?: ReactNode;
  LoadingComponent?: (props?: any) => ReactElement;
  routes: IRoute[];
  initialStack: TStackProps;
  mode?: "default" | "dark";
}

const Stack = createStackNavigator();
export const NavigationRef: any = React.createRef();

export default observer((props: IAppProvider) => {
  const { routes, initialStack, mode } = props;
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    permissions();
    await loadAsync(sourceFonts).catch((e) => console.log(e));
    setLoading(false);
  }, []);

  if (!!loading && !!props.LoadingComponent) {
    return props.LoadingComponent();
  } else if (!!loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer
      ref={NavigationRef}
      theme={mode === "dark" ? DarkTheme : DefaultTheme}
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
