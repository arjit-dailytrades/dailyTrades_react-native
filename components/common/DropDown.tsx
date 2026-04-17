import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

interface Option {
  label: string;
  value: string;
}

export default function FilterDropdown({
  options,
  selected,
  setSelected,
}: {
  options: Option[];
  selected: string | null;
  setSelected: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDark = useColorScheme() === "dark";

  const colors = {
    cardBg: isDark ? "#0e0d0d69" : "#ffffff",
    icon: isDark ? "#fff" : "#1f2937",
    bg: isDark ? "rgba(43, 42, 42, 0.13)" : "rgba(0,0,0,0.05)",
    glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    text: isDark ? "#fff" : "#1f2937",
  };

  return (
    <View>
      {/* Button */}
      <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen(true)}>
        <BlurView
          intensity={isDark ? 40 : 80}
          tint={isDark ? "dark" : "light"}
          style={[
            styles.button,
            {
              backgroundColor: colors.bg,
              borderColor: colors.glassBorder,
            },
          ]}
        >
          <Ionicons name="filter" size={18} color={colors.icon} />
        </BlurView>
      </TouchableOpacity>

      {/* Dropdown */}
      <Modal transparent visible={open} animationType="fade">
        <Pressable style={[styles.overlay, {}]} onPress={() => setOpen(false)}>
          <BlurView
            intensity={isDark ? 40 : 80}
            tint={isDark ? "dark" : "light"}
            style={[
              styles.dropdown,
              {
                borderColor: colors.glassBorder,
                backgroundColor: colors.cardBg,
              },
            ]}
          >
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => {
                  setSelected(item.value);
                  setOpen(false);
                }}
              >
                <View style={styles.optionRow}>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          selected === item.value ? "#2563eb" : colors.text,
                        fontWeight: selected === item.value ? "600" : "400",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>

                  {selected === item.value && (
                    <Ionicons name="checkmark" size={16} color="#2563eb" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </BlurView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 1,
    overflow: "hidden",
    width: 40,
    height: 40,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "500",
  },

  overlay: {
    flex: 1,
  },

  dropdown: {
    position: "absolute",
    top: 70,
    right: 20,
    width: 180,
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
  },
});
