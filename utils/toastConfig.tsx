import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  success: ({ text1 }) => (
    <View style={[styles.pill, styles.pillSuccess]}>
      <View style={styles.dot} />
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),

  error: ({ text1 }) => (
    <View style={[styles.pill, styles.pillError]}>
      <View style={styles.dot} />
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),

  info: ({ text1 }) => (
    <View style={[styles.pill, styles.pillInfo]}>
      <View style={styles.dot} />
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 50,
    gap: 10,
    width: "90%",
    alignSelf: "center",
  },
  pillSuccess: {
    backgroundColor: "#3a9a4a",
  },
  pillError: {
    backgroundColor: "#c0392b",
  },
  pillInfo: {
    backgroundColor: "#2f80c0",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    flexShrink: 1,
  },
});
