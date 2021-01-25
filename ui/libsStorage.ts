import { Camera } from "expo-camera";
import { Model } from "../model/model";

export class CameraProps<T extends Model = any> extends Model<T> {
  ratio = "16:9";
  flashMode = "auto";
  type = Camera.Constants.Type.back;
}

export class Storage<T extends Model = any> extends Model<T> {
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
