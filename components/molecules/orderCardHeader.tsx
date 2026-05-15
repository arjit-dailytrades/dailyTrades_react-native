import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const OrderCardHeader = ({
  item,
  isSuccess,
}: {
  item: any;
  isSuccess: boolean;
}) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.rowBetween, { borderColor: theme.borderColor }]}>
      <View style={styles.headerLeft}>
        <View
          style={[styles.logoPlaceholder, { backgroundColor: theme.innerBox }]}
        >
          <Text style={[styles.logoText, { color: theme.primary }]}>
            {item?.symbol?.[0]}
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
                ? theme.badgeBgPaid
                : "rgba(239,68,68,0.15)",
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
  );
};

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderStyle: "dashed",
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  stockTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 12,
  },
  tagBroker: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  tagTextBroker: {
    fontSize: 10,
    fontWeight: "bold",
  },
  tagStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
