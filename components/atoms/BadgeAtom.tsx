// atoms/BadgeAtom.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BadgeType =
  | "success"
  | "pending"
  | "free"
  | "paid"
  | "segment"
  | "type"
  | "default";

interface BadgeAtomProps {
  label: string;
  type?: BadgeType;
  fontSize?: number;
}

const BadgeAtom: React.FC<BadgeAtomProps> = ({
  label,
  type = "default",
  fontSize = 12,
}) => {
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
      case "segment":
        return styles.segment;
      case "type":
        return styles.tradeType;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.badge, getStyle()]}>
      <Text style={[styles.text, { fontSize }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  text: {
    color: "#fff",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.4,
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
  segment: {
    backgroundColor: "#7c3aed",
  },
  tradeType: {
    backgroundColor: "#b45309",
  },
  default: {
    backgroundColor: "#374151",
  },
});

export default BadgeAtom;
