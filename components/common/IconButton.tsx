import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  icon: React.ComponentProps<typeof AntDesign>["name"];
  color: string;
  active?: boolean;
  onPress?: () => void;
  height?: number;
  width?: number;
  iconSize?: number;
};

const IconButton = ({
  icon,
  color,
  active = false,
  onPress,
  height = 35,
  width = 35,
  iconSize = 14,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.wrapper}
      onPress={onPress}
    >
      <View
        style={[
          styles.button,
          active && styles.activeButton,
          { height, width },
        ]}
      >
        <AntDesign name={icon} size={iconSize} color={color} />
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  wrapper: {},
  button: {
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
