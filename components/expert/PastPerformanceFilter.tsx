import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import FilterDropdown from "../common/DropDown";

export default function PastPerformanceFilter({
  typeOptions,
  segmentOptions,
  segment,
  setSegment,
  type,
  setType,
  priceOption,
  freePaid,
  setFreePaid,
  search,
  setSearch,
  filterOptions,
  selected,
  setSelected,
}: any) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = {
    text: isDark ? "#ffffff" : "#0f172a",
    active: "#2563eb",
    glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    subText: isDark ? "#9CA3AF" : "#666",
    inputBg: isDark ? "#1f29372c" : "#FFF",
    border: isDark ? "#374151" : "#E5E7EB",
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <View
          style={[
            styles.searchContainer,
            {
              borderColor: colors.glassBorder,
              borderWidth: isDark ? 1 : 0,
              backgroundColor: colors.inputBg,
            },
          ]}
        >
          {/* Left Search Icon */}
          <Ionicons
            name="search"
            size={18}
            color={colors.subText}
            style={{ marginRight: 8 }}
          />

          {/* Input */}
          <TextInput
            placeholder="Search Expert Name..."
            placeholderTextColor={colors.subText}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.text }]}
          />

          {/* Right Clear Icon */}
          {search?.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.subText} />
            </TouchableOpacity>
          )}
        </View>
        <FilterDropdown
          options={filterOptions}
          selected={selected}
          setSelected={setSelected}
        />
      </View>

      {/* SEGMENT FILTER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
      >
        {/* Price filter */}
        {priceOption.map((item: any, index: number) => (
          <BlurView
            key={index}
            intensity={isDark ? 25 : 45}
            tint={isDark ? "dark" : "light"}
            style={[
              styles.blurChip,
              {
                borderColor: colors.glassBorder,
                backgroundColor:
                  freePaid === item.value
                    ? isDark
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.08)"
                    : "transparent",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                setFreePaid((prev: string) =>
                  prev === item.value ? "" : item.value,
                )
              }
            >
              <Text style={{ color: colors.text, fontSize: 12 }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </BlurView>
        ))}
        {/* Segment filter */}
        {segmentOptions.map((item: any, index: number) => (
          <BlurView
            key={index}
            intensity={isDark ? 25 : 45}
            tint={isDark ? "dark" : "light"}
            style={[
              styles.blurChip,
              {
                borderColor: colors.glassBorder,
                backgroundColor:
                  segment === item.value
                    ? isDark
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.08)"
                    : "transparent",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                setSegment((prev: string) =>
                  prev === item.value ? "" : item.value,
                )
              }
            >
              <Text style={{ color: colors.text, fontSize: 12 }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </BlurView>
        ))}
        {/* type */}
        {typeOptions.map((item: any, index: number) => (
          <BlurView
            key={index}
            intensity={isDark ? 25 : 45}
            tint={isDark ? "dark" : "light"}
            style={[
              styles.blurChip,
              {
                borderColor: colors.glassBorder,
                backgroundColor:
                  type === item.value
                    ? isDark
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.08)"
                    : "transparent",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                setType((prev: string) =>
                  prev === item.value ? "" : item.value,
                )
              }
            >
              <Text style={{ color: colors.text, fontSize: 12 }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </BlurView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 0,
  },
  filterWrapper: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingHorizontal: 15,
    width: "85%",
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  search: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 100,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    elevation: 3,
  },
  segmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 2,
  },

  freePaidRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  chipRow: {
    marginBottom: 10,
  },
  blurChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  switchContainer: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
    marginLeft: -8,
  },
  // Main Glass Box
  planSwitchContainer: {
    flexDirection: "row",
    borderRadius: 40,
    padding: 3,
    borderWidth: 1,
    overflow: "hidden",
    height: 50,
    alignItems: "center",
  },

  switchBtn: {
    flex: 1,
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },

  btnText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Active Glass Overlay for Buttons
  activeGlassDark: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  activeGlassLight: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});
