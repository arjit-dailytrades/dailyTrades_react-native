import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ["Orders", "Open Orders", "Mutual Funds"];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={[styles.tabItem, activeTab === tab && styles.activeTabBorder]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab ? styles.activeTabText : styles.inactiveTabText,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  tabItem: { flex: 1, paddingVertical: 15, alignItems: "center" },
  activeTabBorder: { borderBottomWidth: 2, borderBottomColor: "#60a5fa" },
  tabText: { fontSize: 14, fontWeight: "500" },
  activeTabText: { color: "#ffffff" },
  inactiveTabText: { color: "#94a3b8" },
});
