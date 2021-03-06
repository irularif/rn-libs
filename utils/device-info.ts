import DeviceInfo from "react-native-device-info";

export interface IDeviceInformation {
  apiLevel: number;
  baseOS: string;
  brand: string;
  buildNumber: string;
  bundleId: string;
  device: string;
  deviceName: string;
  deviceToken: string;
  fontScale: number;
  diskStorage: number;
  diskStorageOld: number;
  hardware: number;
  manufacturer: string;
  macAddress: string;
  installerPackageName: string;
  ipAddress: string;
  lastUpdateTime: number;
  maxMemory: number;
  product: string;
  readableVersion: string;
  systemName: string;
  systemVersion: string;
  buildId: string;
  totalDiskCapacity: number;
  totalDiskCapacityOld: number;
  totalMemory: number;
  uniqueId: string;
  syncUniqueId: string;
  usedMemory: number;
  userAgent: string;
  version: string;
  isAirplaneMode: boolean;
  isBatteryCharging: boolean;
  isEmulator: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  hasNotch: boolean;
  deviceType: string;
}

const DeviceInformation = async (): Promise<IDeviceInformation> => {
  return {
    apiLevel: await DeviceInfo.getApiLevel(),
    baseOS: await DeviceInfo.getBaseOs(),
    brand: await DeviceInfo.getBrand(),
    buildNumber: await DeviceInfo.getBuildNumber(),
    bundleId: await DeviceInfo.getBundleId(),
    device: await DeviceInfo.getDevice(),
    deviceName: await DeviceInfo.getDeviceName(),
    deviceToken: await DeviceInfo.getDeviceToken(),
    fontScale: await DeviceInfo.getFontScale(),
    diskStorage: await DeviceInfo.getFreeDiskStorage(),
    diskStorageOld: await DeviceInfo.getFreeDiskStorageOld(),
    hardware: await DeviceInfo.getFreeDiskStorageOld(),
    manufacturer: await DeviceInfo.getManufacturer(),
    macAddress: await DeviceInfo.getMacAddress(),
    installerPackageName: await DeviceInfo.getInstallerPackageName(),
    ipAddress: await DeviceInfo.getIpAddress(),
    lastUpdateTime: await DeviceInfo.getLastUpdateTime(),
    maxMemory: await DeviceInfo.getMaxMemory(),
    product: await DeviceInfo.getProduct(),
    readableVersion: await DeviceInfo.getReadableVersion(),
    systemName: await DeviceInfo.getSystemName(),
    systemVersion: await DeviceInfo.getSystemVersion(),
    buildId: await DeviceInfo.getSystemVersion(),
    totalDiskCapacity: await DeviceInfo.getTotalDiskCapacity(),
    totalDiskCapacityOld: await DeviceInfo.getTotalDiskCapacityOld(),
    totalMemory: await DeviceInfo.getTotalMemory(),
    uniqueId: await DeviceInfo.getUniqueId(),
    syncUniqueId: await DeviceInfo.syncUniqueId(),
    usedMemory: await DeviceInfo.getUsedMemory(),
    userAgent: await DeviceInfo.getUserAgent(),
    version: await DeviceInfo.getVersion(),
    isAirplaneMode: await DeviceInfo.isAirplaneMode(),
    isBatteryCharging: await DeviceInfo.isBatteryCharging(),
    isEmulator: await DeviceInfo.isEmulator(),
    isTablet: await DeviceInfo.isTablet(),
    isLandscape: await DeviceInfo.isLandscape(),
    hasNotch: await DeviceInfo.hasNotch(),
    deviceType: await DeviceInfo.getDeviceType(),
  };
};

export default DeviceInformation;
