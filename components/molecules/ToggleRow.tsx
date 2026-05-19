import { useAppTheme } from "@/hooks/use-app-theme";
import { StyleSheet, Text, View } from "react-native";
import ToggleSwitch from "../atoms/ToggleSwitch";

interface ToggleRowProps {
  label?: string;
  value?: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  isLast?: boolean;
}
function ToggleRow({
  label,
  value,
  onChange,
  disabled,
  isLast,
}: ToggleRowProps) {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.borderColor,
        },
      ]}
    >
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: theme.primary }]} />
        <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>
      </View>
      <ToggleSwitch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  labelRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  dot: { width: 8, height: 8, borderRadius: 4 },

  label: { fontSize: 14, fontWeight: "500" },
});

export default ToggleRow;
