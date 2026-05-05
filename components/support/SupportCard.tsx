import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: any;
  colors: any;
  onPress: (item: any) => void;
}

export default function SupportCard({ item, colors, onPress }: Props) {
  const statusColor =
    item.status === "RESOLVED"
      ? colors.success
      : item.status === "PENDING"
        ? colors.warning
        : colors.primary;

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>

        <View
          style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {item.status || "Pending"}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.comment, { color: colors.subtext }]}
        numberOfLines={2}
      >
        {item.userComment}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.subtext} />
          <Text style={[styles.date, { color: colors.subtext }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onPress(item)}
          style={[
            styles.arrowCircle,
            { backgroundColor: `${colors.primary}10` },
          ]}
        >
          <Ionicons name="arrow-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 8 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  comment: { fontSize: 13, lineHeight: 18, marginBottom: 15 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  dateRow: { flexDirection: "row", alignItems: "center" },
  date: { fontSize: 12, fontWeight: "500", marginLeft: 4 },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
