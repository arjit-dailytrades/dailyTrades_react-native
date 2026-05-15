import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import FavoriteFollowExpertCardBody from "../molecules/favoriteFollowExpertCardBody";
import FavoriteFollowExpertCardHeader from "../molecules/favoriteFollowExpertCardHeader";

export default function AdvisorCard({ item }: { item: any }) {
  const theme = useAppTheme();

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

  const name = `${item?.advisorDetails?.fName || ""} ${
    item?.advisorDetails?.lName || ""
  }`.trim();

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
      <FavoriteFollowExpertCardHeader
        item={item}
        handlePress={handlePress}
        name={name}
      />

      <FavoriteFollowExpertCardBody item={item} displayType={displayType} />
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
});
