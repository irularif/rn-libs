import { loadAsync } from "expo-font";
import { observer } from "mobx-react";
import React, { ReactElement, useState } from "react";
import { sourceFonts } from "../../assets/fonts";
import permissions from "../../config/permissions";
import useAsyncEffect from "../../hooks/useAsyncEffect";
import Screen from "../Screen";

interface IAppProvider {
  children: ReactElement;
}

export default observer((props: IAppProvider) => {
  const { children } = props;
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    permissions();
    await loadAsync(sourceFonts).catch((e) => console.log(e));
    setLoading(false);
  }, []);

  return (
    <Screen
      statusBar={{
        backgroundColor: "#00000000",
      }}
      style={{
        backgroundColor: !!loading ? "transparent" : "#ffffff",
      }}
    >
      {!loading && children}
    </Screen>
  );
});
