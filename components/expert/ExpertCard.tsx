import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import GlowButton from "../common/GlowButton";

interface AdvisorMapping {
  [key: string]: string;
}

export default function ExpertCard({
  item,
  handleViewPlans,
}: {
  item: any;
  handleViewPlans: (e: any) => void | undefined;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    cardBg: isDark ? "transparent" : "#ffffff",
    borderColor: isDark ? "#FFFFFF1A" : "#0D0D0D1A",
    innerBox: isDark ? "rgba(255, 255, 255, 0.05)" : "#F3F4F6",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666666",
    accent: "#3B82F6",
    accuracyBg: isDark ? "rgba(59, 130, 246, 0.15)" : "#DBEAFE",
  };

  const advisorLabels: AdvisorMapping = {
    SEBI_REGISTERED_ADVISOR: "SEBI Registered Advisor",
    SEBI_RESEARCH_ANALYST: "SEBI Research Analyst",
  };

  const displayType = advisorLabels[item?.rType] || "Investment Advisor";
  const handleSubscribe = () => {
    Alert.alert("Subscribe button clicked");
  };
  const getPlanName = (plan?: string) => {
    switch (plan) {
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      case "sixMonths":
        return "Half-Yearly";
      case "annual":
        return "Yearly";
      default:
        return "N/A";
    }
  };
  const getExpiryDateInFormat = (date?: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as Intl.DateTimeFormatOptions);
  };

  const handlePress = () => {
    router.push({
      pathname: "/expertPastPerformance",
      params: {
        advisorId: item?.id,
      },
    });
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      {/* Top Section */}
      <View style={styles.headerRow}>
        <View style={styles.profileSection}>
          {/* {!item?.dp ? (
            <Image source={{ uri: item?.dp }} style={styles.avatar} />
          ) : (
            <Image
              source={require("../../assets/images/expert.png")}
              style={styles.avatar}
            />
          )} */}
          <TouchableOpacity onPress={handlePress}>
            <View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                },
                item?.isSubscribed && {
                  borderColor: "#4ADE80",
                  borderWidth: 1.5,
                },
              ]}
            >
              <Image
                source={require("../../assets/images/expert.png")}
                style={styles.avatar}
              />
              {item?.isSubscribed && (
                <View style={styles.connectedBadge}>
                  <Text style={styles.connectedText}>
                    <MaterialIcons name="done" size={14} color="white" />
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View>
            <Text style={[styles.name, { color: theme.text }]}>
              {item?.fName} {item?.lName}
            </Text>
            <View
              style={[
                styles.accuracyBadge,
                { backgroundColor: theme.accuracyBg },
              ]}
            >
              <Text style={styles.accuracyText}>
                Accuracy: {item?.accuracy || 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.callsSection}>
          <Text style={[styles.callCount, { color: theme.text }]}>20</Text>
          <Text style={[styles.callLabel, { color: theme.subText }]}>
            AVG. Calls Monthly
          </Text>
        </View> */}
      </View>

      {/* Inner Info Box */}
      <View style={[styles.innerBox, { backgroundColor: theme.innerBox }]}>
        <View style={styles.textColumn}>
          {item?.isSubscribed ? (
            <View>
              <Text style={[styles.infoLabel, { color: theme.subText }]}>
                Trades Remains :{" "}
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {item?.subscriptionPlan?.trades?.balance} /
                  {item?.subscriptionPlan?.trades?.total}
                </Text>
              </Text>

              <Text style={[styles.infoLabel, { color: theme.subText }]}>
                Plan Type :{" "}
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "600",
                    marginLeft: 10,
                  }}
                >
                  {getPlanName(item?.subscriptionPlan?.plan)}
                </Text>
              </Text>

              <Text style={[styles.infoLabel, { color: theme.subText }]}>
                Expiry :{" "}
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {getExpiryDateInFormat(item?.subscriptionPlan?.validUpTo)}
                </Text>
              </Text>
            </View>
          ) : !item?.advisorSubscriptions ? (
            <Text style={{ color: theme.subText }}>
              Advisor is not subscriptable.
            </Text>
          ) : (
            <View>
              <Text style={[styles.infoLabel, { color: theme.subText }]}>
                SEBI NO :{" "}
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {item?.rNo || "N/A"}
                </Text>
              </Text>

              <Text
                style={[
                  styles.infoLabel,
                  { color: theme.subText, marginTop: 8 },
                ]}
              >
                Plan Start From:{" "}
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  ₹
                  {item?.advisorSubscriptions?.subscriptionPlans?.monthly
                    ?.price || 0}
                </Text>
              </Text>
            </View>
          )}
        </View>
        <View style={styles.infoContent}>
          <Text
            style={[
              styles.sebiText,
              { color: theme.subText, textTransform: "capitalize" },
            ]}
          >
            {displayType}
          </Text>
          {item?.isSubscribed ? (
            <GlowButton
              handleClick={() => handleViewPlans(item)}
              title="View Plan"
            />
          ) : (
            <GlowButton handleClick={handleSubscribe} title="Subscribe Now" />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  profileSection: {
    flexDirection: "row",
    // alignItems: "center",
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  connectedBadge: {
    position: "absolute",
    top: -4,
    right: -3,
    backgroundColor: "#4ADE80",
    width: 20,
    height: 20,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  connectedText: { color: "white", fontSize: 12, fontWeight: "bold" },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  accuracyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  accuracyText: {
    color: "#3B82F6",
    fontSize: 11,
    fontWeight: "bold",
  },
  callsSection: {
    alignItems: "flex-end",
  },
  callCount: {
    fontSize: 22,
    fontWeight: "700",
  },
  callLabel: {
    fontSize: 10,
    textAlign: "right",
    width: 70,
  },
  innerBox: {
    borderRadius: 10,
    padding: 10,
  },
  infoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  textColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
  },
  subscribeBtn: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  subscribeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  sebiText: {
    fontSize: 11,
    marginTop: 12,
    opacity: 0.8,
  },
});
