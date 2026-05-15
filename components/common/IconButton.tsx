import { useAppTheme } from "@/hooks/use-app-theme";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  icon: React.ComponentProps<typeof AntDesign>["name"];
  color?: string;
  active?: boolean;
  onPress?: () => void;
  height?: number;
  width?: number;
  iconSize?: number;
};

const IconButton = ({
  icon,
  active = false,
  onPress,
  height = 35,
  width = 35,
  iconSize = 18,
}: Props) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View
        style={[
          styles.button,
          {
            height,
            width,
            backgroundColor: theme.iconBg,
            borderColor: active ? "rgba(255,255,255,0.35)" : theme.glassBorder,
            shadowColor: "#ffffff",
            shadowOpacity: active ? 0.25 : 0.08,
            shadowRadius: active ? 10 : 4,
            shadowOffset: { width: 0, height: 0 },
            elevation: active ? 6 : 2,
          },
        ]}
      >
        <AntDesign
          name={icon}
          size={iconSize}
          color={active ? "#FF5A5F" : theme.iconColor}
        />
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
