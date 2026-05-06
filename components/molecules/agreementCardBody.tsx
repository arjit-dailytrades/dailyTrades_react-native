import { useAppTheme } from "@/hooks/use-app-theme";
import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AgreementCardBody({ item }: { item: any }) {
  const theme = useAppTheme();

  const displayType =
    item?.advisor?.rType === "SEBI_REGISTERED_ADVISOR"
      ? "SEBI Registered Advisor"
      : item?.advisor?.rType === "SEBI_RESEARCH_ANALYST"
        ? "SEBI Research Analyst"
        : "Investment Advisor";

  return (
    <View style={[styles.innerBox, { backgroundColor: theme.innerBox }]}>
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.textColor }]}>
          Reg. Type
        </Text>
        <Text style={[styles.value, { color: theme.subText }]}>
          {displayType}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text
          style={[styles.label, { color: theme.textColor, textAlign: "right" }]}
        >
          Reg. No
        </Text>
        <Text style={[styles.value, { color: theme.subText }]}>
          {item?.advisor?.rNo || "N/A"}
        </Text>
      </View>
      <View style={styles.rowBetween}>
        <Text
          style={[styles.label, { color: theme.textColor, textAlign: "right" }]}
        >
          Date
        </Text>
        <Text style={[styles.value, { color: theme.subText }]}>
          {format(new Date(item?.createdAt), "dd MMM yyyy, hh:mm a")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerBox: {
    borderRadius: 10,
    padding: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
  },

  value: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
});
