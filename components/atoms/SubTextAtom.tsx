import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextProps,
    TextStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
} & TextProps;

const SubTextAtom = ({ children, style, ...rest }: Props) => {
  const theme = useAppTheme();

  return (
    <Text {...rest} style={[{ color: theme.subText }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
});

export default SubTextAtom;
