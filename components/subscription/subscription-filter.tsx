import { BlurView } from "expo-blur";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface FilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function SubscriptionFilters({
  activeFilter,
  setActiveFilter,
  searchText,
  setSearchText,
}: FilterProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const filters = ["Expired", "Annual", "Six Months", "Quarterly", "Monthly"];

  const colors = {
    text: isDark ? "#ffffff" : "#0f172a",
    inputBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
    placeholder: isDark ? "#64748b" : "#94a3b8",
    glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
  };

  return (
    <View style={styles.container}>
      {/* SEARCH INPUT */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.inputBg, borderColor: colors.glassBorder },
        ]}
      >
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by advisor name..."
          placeholderTextColor={colors.placeholder}
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
        />
      </View>

      {/* HORIZONTAL DURATION FILTERS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipContent}
      >
        {filters.map((item, index) => {
          const isActive = activeFilter === item;
          return (
            <BlurView
              key={index}
              intensity={isDark ? 20 : 40}
              tint={isDark ? "dark" : "light"}
              style={[
                styles.blurChip,
                {
                  borderColor: isActive ? "#2563eb" : colors.glassBorder,
                  backgroundColor: isActive
                    ? isDark
                      ? "rgba(37, 99, 235, 0.2)"
                      : "rgba(37, 99, 235, 0.1)"
                    : "transparent",
                },
              ]}
            >
              <TouchableOpacity onPress={() => setActiveFilter(item)}>
                <Text
                  style={[
                    styles.chipText,
                    { color: isActive ? "#3b82f6" : colors.text },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            </BlurView>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  searchContainer: {
    height: 46,
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
    marginBottom: 4,
    marginTop: 4,
  },
  searchInput: {
    fontSize: 14,
    fontWeight: "500",
    height: "100%",
  },
  chipRow: {
    marginVertical: 12,
  },
  chipContent: {
    paddingRight: 20,
  },
  blurChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
