import { NativeModules } from "react-native";

const AES: any = NativeModules.Aes;
const defaultSecretKey = "5xs4d2oA3Ihak01YjMEM";
const saltKey = "PgUBebMA5T1eYyr8G0vI";
export const generateKey = async (secretKey: string = defaultSecretKey) =>
  await AES.pbkdf2(secretKey, saltKey, 5000, 256);
export const encrypt = async (text: string, key: string) => {
  return await AES.randomKey(16).then(async (iv: string) => {
    return await AES.encrypt(text, key, iv).then((cipher: string) => ({
      cipher,
      iv,
    }));
  });
};
export const decrypt = async (
  encryptedData: {
    cipher: string;
    iv: string;
  },
  key: string
) => await AES.decrypt(encryptedData.cipher, key, encryptedData.iv);
