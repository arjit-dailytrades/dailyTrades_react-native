import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CommonButton({
  handleClick,
  title = "Research Report",
  loading = false,
  disabled = false,
  buttonWidth = "100%",
}: {
  handleClick?: () => void;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  buttonWidth?: DimensionValue;
}) {
  return (
    <View style={styles.glowWrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleClick}
        disabled={disabled || loading}
      >
        {/* Outer Border Glow */}
        <LinearGradient
          colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.05)"]}
          style={[styles.borderLayer, { minWidth: buttonWidth }]}
        >
          <BlurView intensity={25} style={styles.blurLayer}>
            {/* Inner Button */}
            <LinearGradient
              colors={["#0f1c3d", "#0a1633"]}
              style={[
                styles.buttonBody,
                (disabled || loading) && styles.disabled,
              ]}
            >
              {/* Top Glass Shine */}
              <LinearGradient
                colors={["rgba(255,255,255,0.25)", "transparent"]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 0.6 }}
                style={styles.shine}
              />

              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.text}>{title}</Text>
              )}
            </LinearGradient>
          </BlurView>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  glowWrapper: {
    shadowColor: "#5aa0ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    alignSelf: "center",
  },

  borderLayer: {
    borderRadius: 999,
    padding: 2,
  },

  blurLayer: {
    borderRadius: 999,
    overflow: "hidden",
  },

  buttonBody: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },

  shine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1%",
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },

  text: {
    color: "#EAF2FF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  disabled: {
    opacity: 0.4,
  },
});
