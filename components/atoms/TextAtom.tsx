import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text } from "react-native";

const TextAtom = ({ children, style }: any) => {
  const theme = useAppTheme();
  return <Text style={[style, { color: theme.textColor }]}>{children}</Text>;
};

const styles = StyleSheet.create({});

export default TextAtom;
