import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

function MenuItem({ icon, title, route, theme, isLast }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        {
          borderBottomColor: theme.borderColor,
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
      onPress={() => router.push(route)}
    >
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color="#6366f1" />
        <ThemedText style={[styles.menuText, { color: theme.textColor }]}>
          {title}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.subText} />
    </TouchableOpacity>
  );
}
export default MenuItem;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
