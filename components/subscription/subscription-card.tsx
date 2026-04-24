import { SubscriptionRecord } from "@/types/subscription";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface SubscriptionCardProps {
  item: SubscriptionRecord;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ item }) => {
  const isActive = !item.isExpired;
  const firstLetter = item.advisor.fName?.charAt(0).toUpperCase() || "";
  const lastLetter = item.advisor.lName?.charAt(0).toUpperCase() || "";
  const initials = `${firstLetter}${lastLetter}`;
  // Format Date and Time
  const dateObj = new Date(item.validUpTo);
  const expiryDate = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const expiryTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          {!item.advisor.dp ? (
            <Image source={{ uri: item.advisor.dp }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.initialsContainer]}>
              <Text style={styles.initialsText}>{initials}</Text>
            </View>
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>
              {`${item.advisor.fName} ${item.advisor.lName}`}
            </Text>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyText}>
                Accuracy: {item.advisor.accuracy}%
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isActive ? "#1b332a" : "#3d1c21" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isActive ? "#4ade80" : "#f87171" },
            ]}
          >
            {isActive ? "Active" : "Expired"}
          </Text>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>Trades Left</Text>
            <Text style={styles.value}>
              {item.trades.balance}/{item.trades.total}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>Plan Type</Text>
            <Text style={[styles.value, { textTransform: "capitalize" }]}>
              {item.plan}
            </Text>
          </View>
        </View>

        <View style={styles.dottedDivider} />

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Expiry Date</Text>
          <Text style={styles.expiryValue}>
            {expiryDate} • {expiryTime}
          </Text>
        </View>
      </View>
    </View>
  );
};
// ... styles remain the same as your provided code

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  initialsContainer: {
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  initialsText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  nameContainer: {
    justifyContent: "center",
  },
  userName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  accuracyBadge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  accuracyText: {
    color: "#60a5fa",
    fontSize: 10,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  detailsBox: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  dottedDivider: {
    borderStyle: "dotted",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    marginVertical: 12,
  },
  expiryValue: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "500",
  },
});
