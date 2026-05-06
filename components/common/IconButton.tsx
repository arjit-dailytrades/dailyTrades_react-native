import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  icon: React.ComponentProps<typeof AntDesign>["name"];
  color: string;
  active?: boolean;
  onPress?: () => void;
};

const IconButton = ({ icon, color, active = false, onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.wrapper}
      onPress={onPress}
    >
      <View style={[styles.button, active && styles.activeButton]}>
        <AntDesign name={icon} size={14} color={color} />
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  wrapper: {},
  button: {
    width: 35,
    height: 35,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  activeButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.3)",
  },
});
