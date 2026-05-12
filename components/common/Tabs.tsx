import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  options?: string[];
}

export const Tabs: React.FC<TabsProps> = ({
  activeTab,
  setActiveTab,
  options,
}) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { borderBottomColor: theme.borderColor }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
      >
        {options?.map((option) => {
          const isActive = activeTab === option;

          return (
            <TouchableOpacity
              key={option}
              onPress={() => setActiveTab(option)}
              style={[
                styles.tabItem,
                isActive && {
                  borderBottomWidth: 2,
                  borderBottomColor: theme.info,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive
                      ? theme.info
                      : theme.textSecondary || theme.textColor,
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
