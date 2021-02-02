import { Permissions } from "react-native-unimodules";
import customPermission from "../../app/config/permissions";

let permissionsRequest = [
  Permissions.CAMERA,
  ...(customPermission || []),
] as any;

const permissions = async () => {
  Permissions.getAsync(...permissionsRequest);
};

export default permissions;
