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

export default function GlowButton({
  handleClick,
  title = "Submit",
  loading = false,
  disabled = false,
  buttonWidth = 150,
}: {
  handleClick?: () => void;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  buttonWidth?: DimensionValue;
}) {
  return (
    <View style={styles.outerGlowWrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleClick}
        disabled={disabled || loading}
      >
        <View style={styles.borderLayer}>
          <BlurView intensity={15} style={styles.blurLayer}>
            <LinearGradient
              colors={["#007BFF", "#0056D2"]}
              style={[
                styles.mainBtnBody,
                (disabled || loading) && styles.disabled,
                { minWidth: buttonWidth },
              ]}
            >
              {/* Glass shine */}
              <LinearGradient
                colors={["rgba(255,255,255,0.25)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.4, y: 0.4 }}
                style={StyleSheet.absoluteFill}
              />

              <LinearGradient
                colors={["transparent", "rgba(255,255,255,0.2)"]}
                start={{ x: 0.6, y: 0.6 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{title}</Text>
              )}
            </LinearGradient>
          </BlurView>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerGlowWrapper: {
    shadowColor: "#0068FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    alignSelf: "center",
  },
  borderLayer: {
    borderRadius: 100,
    padding: 2.5,
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    overflow: "hidden",
  },
  blurLayer: {
    borderRadius: 100,
    overflow: "hidden",
  },
  mainBtnBody: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  disabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
