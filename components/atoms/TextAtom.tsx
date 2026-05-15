import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import {
  StyleProp,
  Text,
  TextProps,
  TextStyle
} from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
} & TextProps;

const TextAtom = ({ children, style, ...rest }: Props) => {
  const theme = useAppTheme();

  return (
    <Text {...rest} style={[{ color: theme.textColor }, style]}>
      {children}
    </Text>
  );
};

export default TextAtom;
