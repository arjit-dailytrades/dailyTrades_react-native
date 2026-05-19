import React from "react";
import { StyleSheet, View } from "react-native";

interface BulletDotProps {
  color?: string;
  size?: number;
}

export const BulletDot: React.FC<BulletDotProps> = ({
  color = "#2196F3",
  size = 7,
}) => {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    marginRight: 8,
  },
});

export default BulletDot;
