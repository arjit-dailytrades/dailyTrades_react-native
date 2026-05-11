import { useAppTheme } from "@/hooks/use-app-theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: any;
  onPress: (item: any) => void;
}

export default function SupportCard({ item, onPress }: Props) {
  const theme = useAppTheme();
  const statusColor =
    item.status === "RESOLVED"
      ? theme.success
      : item.status === "PENDING"
        ? theme.warning
        : theme.primary;

  return (
    <View style={[styles.card, { borderColor: theme.borderColor }]}>
      <View style={styles.cardHeader}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            gap: 5,
          }}
        >
          {item?.attachment ? (
            <TouchableOpacity
              style={[
                styles.arrowCircle,
                { backgroundColor: `${theme.primary}10` },
              ]}
            >
              <AntDesign name="file-done" size={14} color={theme.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.arrowCircle,
                { backgroundColor: `${theme.primary}10` },
              ]}
            >
              <AntDesign name="file-excel" size={14} color={theme.error} />
            </TouchableOpacity>
          )}

          <Text
            style={[styles.title, { color: theme.textColor }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>

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
        style={[styles.comment, { color: theme.subText }]}
        numberOfLines={2}
      >
        {item.userComment}
      </Text>

      <View style={[styles.cardFooter, { borderColor: theme.borderColor }]}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={theme.subText} />
          <Text style={[styles.date, { color: theme.subText }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onPress(item)}
          style={[
            styles.arrowCircle,
            { backgroundColor: `${theme.primary}10` },
          ]}
        >
          <Ionicons name="eye" size={18} color={theme.primary} />
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
    borderStyle: "dashed",
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
