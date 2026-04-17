import PageHeader from "@/components/common/PageHeader";
import React from "react";
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PremiumTools() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = {
    bg: isDark ? "#060B1A" : "#F3F4F6",
    card: isDark ? "#1E293B" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666",
    border: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
    primary: "#6366F1",
    success: "#22C55E",
    warning: "#F59E0B",
  };

  const tools = [
    { id: "1", name: "AI Signals" },
    { id: "2", name: "Advanced Charts" },
    { id: "3", name: "Backtesting" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <PageHeader title="Premium Tools" />
      <FlatList
        data={tools}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={{ color: colors.text }}>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
});
