import React from "react";
import { StyleSheet, Text, View } from "react-native";

const BadgeAtom = ({ label, type = "default" }: any) => {
  const getStyle = () => {
    switch (type) {
      case "success":
        return styles.success;
      case "pending":
        return styles.pending;
      case "free":
        return styles.free;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.badge, getStyle()]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    color: "#fff",
    fontSize: 11,
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
  default: {
    backgroundColor: "#374151",
  },
});

export default BadgeAtom;
