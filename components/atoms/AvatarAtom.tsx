import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const getInitials = (name: string = "") => {
  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 0) return "";
  if (words.length === 1) return words[0][0]?.toUpperCase();

  return ((words[0][0] || "") + (words[1][0] || "")).toUpperCase();
};

// Generate consistent color
const getBackgroundColor = (name: string = "") => {
  const colors = ["#2563eb", "#16a34a", "#db2777", "#f59e0b", "#7c3aed"];
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

interface Props {
  uri?: string;
  name?: string;
  width?: number;
  height?: number;
}

const AvatarAtom: React.FC<Props> = ({
  uri,
  name = "",
  width = 42,
  height = 42,
}) => {
  const sizeStyle = {
    width,
    height,
    borderRadius: width / 2,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.avatar, sizeStyle]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        sizeStyle,
        { backgroundColor: getBackgroundColor(name) },
      ]}
    >
      <Text style={[styles.initials, { fontSize: width * 0.35 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default AvatarAtom;
