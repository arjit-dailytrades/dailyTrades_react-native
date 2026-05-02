import React from "react";
import { StyleSheet, Text } from "react-native";

const TextAtom = ({ children, style }: any) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
});

export default TextAtom;
