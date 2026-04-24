import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

interface OrderCardProps {
  stockName: string;
  exchange: string;
  status: "Success" | "Failed";
  side: string;
  entry: string;
  stopLoss: string;
  target: string;
  date: string;
  time: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  stockName,
  exchange,
  status,
  side,
  entry,
  stopLoss,
  target,
  date,
  time,
}) => {
  const isSuccess = status === "Success";
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = {
    cardBg: isDark ? "transparent" : "#ffffff",
    boxBg: isDark ? "#FFFFFF0D" : "#f8f9fa",
    textColor: isDark ? "#ffffff" : "#000000",
    subText: isDark ? "#fff" : "#000",
    borderColor: isDark ? "#FFFFFF1A" : "#0D0D0D1A",
    badgeBgFree: isDark ? "#15397C" : "#d6e3fa",
    badgeBgPaid: isDark ? "#00ff8c" : "#cefbe6",
    detailBg: isDark ? "#FFFFFF0F" : "#87868617",
    chatBtnBorder: isDark ? "#FFFFFF33" : "#000",
    valColor: isDark ? "#FFFFFF80" : "#FFFFFF80",
  };

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      <View style={styles.rowBetween}>
        <View style={styles.headerLeft}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>{stockName[0]}</Text>
          </View>
          <View>
            <Text style={styles.stockTitle}>{stockName}</Text>
            <Text style={styles.subText}>{exchange} • Equity</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.tagDhan}>
            <Text style={styles.tagTextDhan}>DHAN</Text>
          </View>
          <View
            style={[
              styles.tagStatus,
              { backgroundColor: isSuccess ? "#1b332a" : "#3d1c21" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isSuccess ? "#4ade80" : "#f87171" },
              ]}
            >
              {status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsGrid}>
        <View>
          <Text style={styles.label}>Side</Text>
          <View style={styles.buyBadge}>
            <Text style={styles.buyText}>{side}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Entry</Text>
          <View style={styles.marketBadge}>
            <Text style={styles.marketText}>{entry}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.detailsGrid, { marginTop: 12 }]}>
        <View>
          <Text style={styles.label}>Stop Loss</Text>
          <View style={styles.valueBadge}>
            <Text style={styles.valueText}>{stopLoss}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Target</Text>
          <View style={styles.valueBadge}>
            <Text style={styles.valueText}>{target}</Text>
          </View>
        </View>
      </View>

      <View style={styles.dottedDivider} />

      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={14}
          color="#94a3b8"
        />
        <Text style={styles.footerText}>
          {date} • {time}
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
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: { fontWeight: "bold", color: "#be123c" },
  stockTitle: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  subText: { color: "#94a3b8", fontSize: 12 },
  tagDhan: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  tagTextDhan: { color: "#60a5fa", fontSize: 10, fontWeight: "bold" },
  tagStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#1e293b", marginVertical: 12 },
  dottedDivider: {
    borderStyle: "dotted",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    marginVertical: 12,
  },
  detailsGrid: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "#94a3b8", fontSize: 12, marginBottom: 6 },
  buyBadge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buyText: { color: "#4ade80", fontSize: 12, fontWeight: "600" },
  marketBadge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  marketText: { color: "#94a3b8", fontSize: 12 },
  valueBadge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: "center",
  },
  valueText: { color: "#94a3b8", fontSize: 14 },
  footer: { flexDirection: "row", alignItems: "center" },
  footerText: { color: "#94a3b8", fontSize: 12, marginLeft: 6 },
});
