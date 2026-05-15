import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FavoriteFollowExpertCardBody({
  item,
  displayType,
}: {
  item: any;
  displayType: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.innerBox, { backgroundColor: theme.innerBox }]}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={[styles.label, { color: theme.subText }]}>
            Reg. Type
          </Text>
          <Text style={[styles.value, { color: theme.textColor }]}>
            {displayType}
          </Text>
        </View>

        <View>
          <Text
            style={[styles.label, { color: theme.subText, textAlign: "right" }]}
          >
            Reg. No
          </Text>
          <Text style={[styles.value, { color: theme.textColor }]}>
            {item?.advisorDetails?.rNo || "N/A"}
          </Text>
        </View>
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
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
});
