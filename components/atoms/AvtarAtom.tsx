import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const getInitials = (name: string = "") => {
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0]?.toUpperCase();

  return ((words[0][0] || "") + (words[1][0] || "")).toUpperCase();
};

// Optional: generate consistent color based on name
const getBackgroundColor = (name: string) => {
  const colors = ["#2563eb", "#16a34a", "#db2777", "#f59e0b", "#7c3aed"];
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

const AvatarAtom = ({ uri, name }: any) => {
  if (uri) {
    return <Image source={{ uri }} style={styles.avatar} />;
  }

  return (
    <View
      style={[styles.avatar, { backgroundColor: getBackgroundColor(name) }]}
    >
      <Text style={styles.initials}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default AvatarAtom;
