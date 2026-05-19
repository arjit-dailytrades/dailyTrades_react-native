import React from "react";
import { Alert, StyleSheet, useColorScheme, View } from "react-native";

import { router } from "expo-router";
import ExpertCardBody from "../molecules/ExpertCardBody";
import ExpertCardHeader from "../molecules/ExpertCardHeader";

interface AdvisorMapping {
  [key: string]: string;
}

export default function ExpertCard({
  item,
  handleViewPlans,
  markUnMarkAsFavorite,
  followUnFollow,
}: {
  item: any;
  handleViewPlans: (e: any) => void | undefined;
  markUnMarkAsFavorite: any;
  followUnFollow: any;
}) {
  const isDark = useColorScheme() === "dark";

  const theme = {
    cardBg: isDark ? "transparent" : "#ffffff",
    borderColor: isDark ? "#FFFFFF1A" : "#0D0D0D1A",
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

  const name = `${item?.fName || ""} ${item?.lName || ""}`.trim();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      {/* Header */}
      <ExpertCardHeader
        item={item}
        markUnMarkAsFavorite={markUnMarkAsFavorite}
        followUnFollow={followUnFollow}
        handlePress={handlePress}
        name={name}
      />

      {/* Body */}
      <ExpertCardBody
        item={item}
        handleViewPlans={handleViewPlans}
        getPlanName={getPlanName}
        getExpiryDateInFormat={getExpiryDateInFormat}
        handleSubscribe={handleSubscribe}
        displayType={displayType}
      />
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
});
