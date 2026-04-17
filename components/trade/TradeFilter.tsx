import { RootState } from "@/redux/store";
import { BlurView } from "expo-blur";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSelector } from "react-redux";

export default function TradeFilters({
  typeOptions,
  segmentOptions,
  segment,
  setSegment,
  type,
  setType,
  freePaid,
  setFreePaid,
}: any) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const { statsCount } = useSelector((state: RootState) => state.script);

  const colors = {
    bg: isDark ? "#020617" : "#f1f5f9",
    text: isDark ? "#ffffff" : "#0f172a",
    muted: isDark ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.5)",
    active: "#2563eb",
    glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
  };

  return (
    <View style={styles.container}>
      {/* TYPE SWITCH */}
      <View style={styles.segmentRow}>
        {segmentOptions.map((item: any, index: number) => (
          <View style={styles.switchWrapper} key={index}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>
              {item.label}
            </Text>

            <View style={styles.redDot}>
              <Text style={styles.countText}>{item.count}</Text>
            </View>

            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: "#334155", true: colors.active }}
                thumbColor="#fff"
                value={segment === item.value}
                onValueChange={() =>
                  setSegment((prev: string) =>
                    prev === item.value ? "" : item.value,
                  )
                }
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.line, { backgroundColor: colors.glassBorder }]} />

      {/* SEGMENT FILTER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
      >
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
                {item.label} ({item.count})
              </Text>
            </TouchableOpacity>
          </BlurView>
        ))}
      </ScrollView>

      {/* FREE / PAID SWITCH */}
      <BlurView
        intensity={isDark ? 30 : 60}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.planSwitchContainer,
          { borderColor: colors.glassBorder },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.switchBtn,
            freePaid === "PAID" &&
              (isDark ? styles.activeGlassDark : styles.activeGlassLight),
          ]}
          onPress={() =>
            setFreePaid((prev: string) => (prev === "PAID" ? "" : "PAID"))
          }
        >
          <View style={styles.freePaidRow}>
            <Text style={[styles.btnText, { color: colors.text }]}>Paid</Text>

            <View style={styles.freePaidCountDot}>
              <Text style={styles.countText}>
                {statsCount?.scripts?.priceCounts?.paidScriptCount}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switchBtn,
            freePaid === "FREE" &&
              (isDark ? styles.activeGlassDark : styles.activeGlassLight),
          ]}
          onPress={() =>
            setFreePaid((prev: string) => (prev === "FREE" ? "" : "FREE"))
          }
        >
          <View style={styles.freePaidRow}>
            <Text style={[styles.btnText, { color: colors.text }]}>Free</Text>

            <View style={styles.freePaidCountDot}>
              <Text style={styles.countText}>
                {statsCount?.scripts?.priceCounts?.freeScriptCount}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 0,
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
  redDot: {
    backgroundColor: "#ff0800",
    minWidth: 16,
    height: 16,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginRight: 8,
    marginTop: -10,
  },
  freePaidRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  freePaidCountDot: {
    backgroundColor: "#ff0800",
    minWidth: 16,
    height: 16,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginLeft: 4,
    marginBottom: -2,
  },

  countText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  line: {
    height: 1,
    width: "100%",
    marginBottom: 5,
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
