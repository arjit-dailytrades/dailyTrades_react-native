// atoms/TimeStamp.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

interface TimeStampProps {
  isoString: string;
  style?: TextStyle;
}

const Timestamp: React.FC<TimeStampProps> = ({ isoString, style }) => {
  const theme = useAppTheme();
  return <Text style={[styles.time, style]}>{formatTime(isoString)}</Text>;
};

const styles = StyleSheet.create({
  time: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});

export default Timestamp;
