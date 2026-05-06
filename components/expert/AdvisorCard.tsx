import { router } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import AvatarAtom from "../atoms/AvtarAtom";
import IconButton from "../common/IconButton";

export default function AdvisorCard({ item }: { item: any }) {
  const isDark = useColorScheme() === "dark";

  const theme = {
    cardBg: isDark ? "transparent" : "#ffffff",
    borderColor: isDark ? "#FFFFFF1A" : "#0D0D0D1A",
    innerBox: isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666",
  };

  const displayType =
    item?.advisorDetails?.rType === "SEBI_REGISTERED_ADVISOR"
      ? "SEBI Registered Advisor"
      : item?.advisorDetails?.rType === "SEBI_RESEARCH_ANALYST"
        ? "SEBI Research Analyst"
        : "Investment Advisor";

  const handlePress = () => {
    router.push({
      pathname: "/expertPastPerformance",
      params: { advisorId: item?.advisorId },
    });
  };
  const firstName = item?.advisorDetails?.fName || "";
  const lastName = item?.advisorDetails?.lName || "";

  const name = `${firstName} ${lastName}`.trim();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
          <View style={styles.profileSection}>
            <View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                },
              ]}
            >
              <AvatarAtom
                //   uri={item?.advisorDetails?.dp}
                name={name}
              />
            </View>

            <View>
              <Text style={[styles.name, { color: theme.text }]}>
                {`${item?.advisorDetails?.fName} ${item?.advisorDetails?.lName}`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actions}>
          {item?.favourite && <IconButton icon="heart" color="red" active />}

          {item?.follow && (
            <IconButton icon="user-add" color="#0068FF" active />
          )}
        </View>
      </View>

      {/* Info */}
      <View style={[styles.innerBox, { backgroundColor: theme.innerBox }]}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.label, { color: theme.subText }]}>
              Reg. Type
            </Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {displayType}
            </Text>
          </View>

          <View>
            <Text
              style={[
                styles.label,
                { color: theme.subText, textAlign: "right" },
              ]}
            >
              Reg. No
            </Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {item?.advisorDetails?.rNo || "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    gap: 6,
  },

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
