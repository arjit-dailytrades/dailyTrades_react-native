// atoms/UnreadDot.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface UnreadDotProps {
  isRead?: boolean;
}

const UnreadDot: React.FC<UnreadDotProps> = ({ isRead = false }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRead) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulse.stopAnimation();
    }
  }, [isRead, pulse]);

  if (isRead) return null;

  return (
    <Animated.View style={[styles.dot, { transform: [{ scale: pulse }] }]} />
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default UnreadDot;
