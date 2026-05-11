import React from "react";
import { StyleSheet, Text, View } from "react-native";

const BadgeAtom = ({ label, type = "default", fontSize = 12 }: any) => {
  const getStyle = () => {
    switch (type) {
      case "success":
        return styles.success;
      case "pending":
        return styles.pending;
      case "free":
        return styles.free;
      case "paid":
        return styles.paid;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.badge, getStyle()]}>
      <Text style={[styles.text, { fontSize: fontSize }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  text: {
    color: "#fff",
    fontWeight: "500",
  },
  success: {
    backgroundColor: "#16a34a",
  },
  pending: {
    backgroundColor: "#f59e0b",
  },
  free: {
    backgroundColor: "#2563eb",
  },
  paid: {
    backgroundColor: "#16a34a",
  },
  default: {
    backgroundColor: "#374151",
  },
});

export default BadgeAtom;
