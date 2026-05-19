import ToggleRow from "@/components/molecules/ToggleRow";
import { StyleSheet, View } from "react-native";

interface TradeAlertSectionProps {
  allTradeAlert: boolean;
  customTradeAlert: boolean;
  allTradeAlertLoading: boolean;
  customTradeAlertLoading: boolean;
  onAllTradeAlertToggle: (value: boolean) => void;
  onCustomTradeAlertToggle: (value: boolean) => void;
  theme: Record<string, string>;
}

export default function TradeAlertSection({
  allTradeAlert,
  customTradeAlert,
  allTradeAlertLoading,
  customTradeAlertLoading,
  onAllTradeAlertToggle,
  onCustomTradeAlertToggle,
  theme,
}: TradeAlertSectionProps) {
  return (
    <View
      style={[
        styles.card,
        {
          marginTop: 12,
          backgroundColor: theme.cardColor,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <ToggleRow
        label="All Trade Alerts"
        value={allTradeAlert}
        onChange={onAllTradeAlertToggle}
        disabled={allTradeAlertLoading}
      />
      <ToggleRow
        label="Custom Trade Alerts"
        value={customTradeAlert}
        onChange={onCustomTradeAlertToggle}
        disabled={customTradeAlertLoading}
        isLast
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
