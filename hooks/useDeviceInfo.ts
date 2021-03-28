import DeviceInformation, { IDeviceInformation } from "libs/utils/device-info";
import { useState } from "react";
import useAsyncEffect from "./useAsyncEffect";

export default () => {
  const [deviceInfo, setDeviceInfo] = useState({});
  useAsyncEffect(async () => {
    await DeviceInformation()
      .then((res: any) => {
        setDeviceInfo(res);
      })
      .catch((e) => console.log(e));
  }, []);

  return deviceInfo as IDeviceInformation;
};
