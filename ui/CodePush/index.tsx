import AppConfig from "libs/config/app";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { ViewProps } from "react-native";
import codePush from "react-native-code-push";
import CodepushConfig from "../../config/code-push";
import Loading from "./Loading";

interface ICodePush extends ViewProps {
  children: ReactNode;
  LoadingComponent?: (props: any) => ReactElement;
}

const Main = (props: ICodePush) => {
  const meta = useLocalObservable(() => ({
    loading: true,
    syncMessage: "",
    progress: null,
  }));
  const init = async () => {
    if (!meta.loading) {
      runInAction(() => (meta.loading = true));
    }
    codePush.allowRestart();
    codePush.getUpdateMetadata(codePush.UpdateState.RUNNING);
    codePush.sync(
      CodepushConfig,
      (syncStatus: any) => {
        runInAction(() => {
          switch (syncStatus) {
            case codePush.SyncStatus.SYNC_IN_PROGRESS:
              meta.syncMessage = "Loading...";
              setTimeout(() => {
                meta.loading = false;
              }, 15000);
              break;
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              meta.syncMessage = "Checking for update...";
              break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              meta.syncMessage = "Downloading package...";
              break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
              meta.syncMessage = "Awaiting user action...";
              break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
              meta.syncMessage = "Installing update...";
              break;
            case codePush.SyncStatus.UP_TO_DATE:
              meta.syncMessage = "App up to date.";
              meta.loading = false;
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              meta.syncMessage = "Update installed, restarting the app.";
              codePush.restartApp();
              break;
            default:
              meta.syncMessage = "An unknown error occurred.";
              meta.loading = false;
              break;
          }
        });
      },
      (progress: any) => {
        runInAction(() => (meta.progress = progress));
      }
    );
  };

  useEffect(() => {
    if (AppConfig.mode === "dev") {
      runInAction(() => (meta.loading = false));
    } else {
      init();
    }
  }, []);

  if (!!meta.loading && !!props.LoadingComponent) {
    return props.LoadingComponent({
      progress: meta.progress,
      syncMessage: meta.syncMessage,
    });
  } else if (!!meta.loading) {
    return <Loading progress={meta.progress} syncMessage={meta.syncMessage} />;
  }

  return props.children;
};

export default observer(codePush(CodepushConfig)(Main));
