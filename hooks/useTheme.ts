import { useTheme } from "@react-navigation/native";
import { ITheme } from "..//config/theme";

export default () => {
  const theme = useTheme();

  return theme as ITheme;
};
