import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const OrderCard = ({ item }: { item: any }) => {
  const isSuccess = item.status === "Success" || item.status === "SUCCESS";
  const isBuy = item.side === "BUY";
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      {/* Header */}
      <View style={styles.rowBetween}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.logoPlaceholder,
              { backgroundColor: theme.innerBox },
            ]}
          >
            <Text style={[styles.logoText, { color: theme.primary }]}>
              {item?.symbol[0]}
            </Text>
          </View>
          <View>
            <Text style={[styles.stockTitle, { color: theme.textColor }]}>
              {item?.symbol}
            </Text>
            <Text style={[styles.subText, { color: theme.subText }]}>
              {item?.exchange} • {item?.instrumentType}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          {/* Broker Badge */}
          <View style={[styles.tagBroker, { backgroundColor: theme.iconBg }]}>
            <Text style={[styles.tagTextBroker, { color: theme.textColor }]}>
              {item?.broker}
            </Text>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.tagStatus,
              {
                backgroundColor: isSuccess
                  ? theme.badgeBgPaid // green tint
                  : "rgba(239,68,68,0.15)", // red tint works on both themes
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isSuccess ? theme.success : "#ef4444" },
              ]}
            >
              {item?.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

      {/* Side & Entry */}
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

      <View
        style={[styles.dottedDivider, { borderBottomColor: theme.borderColor }]}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={14}
          color={theme.subText}
        />
        <Text style={[styles.footerText, { color: theme.subText }]}>
          {format(new Date(item?.createdAt), "dd MMM yyyy, hh:mm a")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: { flexDirection: "row", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: { fontWeight: "bold", fontSize: 16 },
  stockTitle: { fontSize: 16, fontWeight: "bold" },
  subText: { fontSize: 12 },
  tagBroker: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  tagTextBroker: { fontSize: 10, fontWeight: "bold" },
  tagStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: "bold" },
  divider: { height: 1, marginVertical: 12 },
  dottedDivider: {
    borderStyle: "dotted",
    borderBottomWidth: 1,
    marginVertical: 12,
  },
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
  footer: { flexDirection: "row", alignItems: "center" },
  footerText: { fontSize: 12, marginLeft: 6 },
});
