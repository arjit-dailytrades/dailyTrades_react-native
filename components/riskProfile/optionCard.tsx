import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OptionProps {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const BLUE = "#4f9cf9";
const CARD_BG = "rgba(255,255,255,0.05)";
const CARD_BORDER = "rgba(255,255,255,0.12)";
const CARD_SELECTED_BG = "rgba(79,156,249,0.12)";

const OptionCard: React.FC<OptionProps> = ({
  label,
  description,
  selected,
  onPress,
  disabled = false,
}) => {
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.optionCard, selected && styles.optionCardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Text style={styles.checkMark}>✓</Text>}
      </View>

      <View style={styles.optionTextWrap}>
        <Text
          style={[
            styles.optionLabel,
            selected && styles.optionLabelSelected,
            { color: theme.textColor },
          ]}
        >
          {label}
        </Text>
        <Text style={[styles.optionDesc, { color: theme.subText }]}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default OptionCard;

const styles = StyleSheet.create({
  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: CARD_BG,
    borderWidth: 0.5,
    borderColor: CARD_BORDER,
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
  },
  optionCardSelected: {
    backgroundColor: CARD_SELECTED_BG,
    borderColor: BLUE,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
    marginRight: 10,
    marginTop: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  checkMark: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },

  optionTextWrap: { flex: 1 },

  optionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  optionLabelSelected: {
    color: "#ffffff",
  },

  optionDesc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.38)",
    marginTop: 2,
  },
});
