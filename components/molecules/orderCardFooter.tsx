import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const OrderCardFooter = ({ item }: { item: any }) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.footer, { borderColor: theme.borderColor }]}>
      <MaterialCommunityIcons
        name="clock-outline"
        size={14}
        color={theme.subText}
      />
      <Text style={[styles.footerText, { color: theme.subText }]}>
        {format(new Date(item?.createdAt), "dd MMM yyyy, hh:mm a")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderStyle: "dashed",
    borderTopWidth: 1,
    paddingTop: 12,
    marginVertical: 12,
  },
  footerText: { fontSize: 12, marginLeft: 6 },
});
