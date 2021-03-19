import PagerView, { PagerViewProps } from "react-native-pager-view";
import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { StyleSheet } from "react-native";
import { ITheme } from "../../config/theme";

export interface IPagerViewProps extends PagerViewProps {
  shadow?: boolean;
  childRef?: any;
}

export default observer((props: IPagerViewProps) => {
  const { shadow, style, childRef } = props;
  const Theme: ITheme = useTheme() as any;
  const shadowStyle = !!shadow ? Theme.shadow : {};
  let cstyle = StyleSheet.flatten([shadowStyle, style]);

  return <PagerView {...(props as any)} style={cstyle} ref={childRef} />;
});
