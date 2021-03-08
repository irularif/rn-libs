import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import useAsyncEffect from "./useAsyncEffect";

interface INotif {
  enabled: boolean;
  token: string;
}

export const requestUserPermission = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    return await requestUserPermission();
  } else {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#ffffff",
        sound: "default",
      }).catch((e) => console.log(e));
    }
  }
  return enabled;
};

export default (
  action: (notif: INotif) => Promise<void>,
  onTokenRefresh: (token: string) => void,
  onReceiveMessage: (
    appState: AppStateStatus,
    message: FirebaseMessagingTypes.RemoteMessage
  ) => void,
  dependencies: any[],
  cleanup?: () => void
) => {
  const [enabled, setEnabled] = useState(false);
  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (enabled) {
      if (nextAppState === "active") {
        messaging().onMessage((remoteMessage) => {
          onReceiveMessage(nextAppState, remoteMessage);
        });
      } else {
        messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
          onReceiveMessage(nextAppState, remoteMessage);
        });
      }
    }
  };

  const run = async () => {
    if (enabled) {
      const token = await messaging().getToken();
      messaging().onTokenRefresh(onTokenRefresh);
      if (enabled && token) {
        action({
          enabled,
          token,
        });
      }
    }
  };

  useEffect(() => {
    if (enabled) {
      run();
      AppState.removeEventListener("change", _handleAppStateChange);
      AppState.addEventListener("change", _handleAppStateChange);
    }

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
      if (cleanup) {
        cleanup();
      }
    };
  }, [enabled]);

  useAsyncEffect(async () => {
    const enabled = await requestUserPermission();
    setEnabled(enabled);
  }, dependencies);
};
