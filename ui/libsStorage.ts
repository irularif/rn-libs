import { Camera } from "expo-camera";
import { Model } from "../model/model";

export class CameraProps extends Model {
  ratio = "16:9";
  flashMode = "auto";
  type = Camera.Constants.Type.back;
}

export class Storage extends Model {
  hasCameraPermission = false;
  hasImagePickPermission = false;
  camera = CameraProps.childOf(this);
  cacheExist = false;
}

const libsStorage = Storage.create({
  localStorage: true,
  storageName: "libs",
});
export default libsStorage;
