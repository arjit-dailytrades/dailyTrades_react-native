import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const OrderCardBody = ({
  item,
  isBuy,
}: {
  item: any;
  isBuy: boolean;
}) => {
  const theme = useAppTheme();

  return (
    <View>
      <View style={styles.detailsGrid}>
        <View>
          <Text style={[styles.label, { color: theme.subText }]}>Side</Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isBuy
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isBuy ? theme.success : "#ef4444" },
              ]}
            >
              {item?.side}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.label, { color: theme.subText }]}>Entry</Text>
          <View style={[styles.badge, { backgroundColor: theme.innerBox }]}>
            <Text style={[styles.badgeText, { color: theme.valColor }]}>
              {item?.entryType}
            </Text>
          </View>
        </View>
      </View>

      {/* Stop Loss & Target */}
      <View style={[styles.detailsGrid, { marginTop: 12 }]}>
        <View>
          <Text style={[styles.label, { color: theme.subText }]}>
            Stop Loss
          </Text>
          <View
            style={[styles.valueBadge, { backgroundColor: theme.innerBox }]}
          >
            <Text style={[styles.valueText, { color: theme.valColor }]}>
              {item?.stopLoss}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.label, { color: theme.subText }]}>Target</Text>
          <View
            style={[styles.valueBadge, { backgroundColor: theme.innerBox }]}
          >
            <Text style={[styles.valueText, { color: theme.valColor }]}>
              {item?.target}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsGrid: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 12, marginBottom: 6 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  valueBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: "center",
  },
  valueText: { fontSize: 14 },
});
