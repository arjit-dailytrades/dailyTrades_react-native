import React from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
    ViewStyle,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  minHeightFraction?: number;
  contentStyle?: ViewStyle;
  avoidKeyboard?: boolean;
}

export default function BottomSheetModal({
  isVisible,
  onClose,
  children,
  minHeightFraction = 0.4,
  contentStyle,
  avoidKeyboard = false,
}: BottomSheetModalProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const sheet = (
    <View
      style={[
        styles.modalContent,
        {
          backgroundColor: isDark ? "#0A0F1D" : "#FFFFFF",
          minHeight: SCREEN_HEIGHT * minHeightFraction,
        },
        contentStyle,
      ]}
    >
      <View
        style={[
          styles.handle,
          { backgroundColor: isDark ? "#2D3748" : "#CBD5E1" },
        ]}
      />

      {children}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Tap outside to dismiss */}
        <TouchableOpacity
          style={styles.dismissArea}
          onPress={onClose}
          activeOpacity={1}
        />

        {avoidKeyboard ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {sheet}
          </KeyboardAvoidingView>
        ) : (
          sheet
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  dismissArea: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 15,
  },
});
