import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GlowButton from "../common/GlowButton";

export default function ExpertCardBody({
  item,
  handleViewPlans,
  getExpiryDateInFormat,
  handleSubscribe,
  getPlanName,
  displayType,
}: {
  item: any;
  handleViewPlans: (e: any) => void | undefined;
  getExpiryDateInFormat: (date?: string) => string;
  handleSubscribe: () => void;
  getPlanName: (plan?: string) => string;
  displayType: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.innerBox, { backgroundColor: theme.innerBox }]}>
      <View style={styles.textColumn}>
        {item?.isSubscribed ? (
          <View>
            <Text style={[styles.infoLabel, { color: theme.subText }]}>
              Trades Remains:{" "}
              <Text style={{ color: theme.textColor, fontWeight: "600" }}>
                {item?.subscriptionPlan?.trades?.balance} /{" "}
                {item?.subscriptionPlan?.trades?.total}
              </Text>
            </Text>

            <Text style={[styles.infoLabel, { color: theme.subText }]}>
              Plan Type:{" "}
              <Text style={{ color: theme.textColor, fontWeight: "600" }}>
                {getPlanName(item?.subscriptionPlan?.plan)}
              </Text>
            </Text>

            <Text style={[styles.infoLabel, { color: theme.subText }]}>
              Expiry:{" "}
              <Text style={{ color: theme.textColor, fontWeight: "600" }}>
                {getExpiryDateInFormat(item?.subscriptionPlan?.validUpTo)}
              </Text>
            </Text>
          </View>
        ) : !item?.advisorSubscriptions ? (
          <Text style={{ color: theme.subText }}>
            Expert is not subscriptable.
          </Text>
        ) : (
          <View>
            <Text style={[styles.infoLabel, { color: theme.subText }]}>
              SEBI NO:{" "}
              <Text style={{ color: theme.textColor, fontWeight: "600" }}>
                {item?.rNo || "N/A"}
              </Text>
            </Text>

            <Text
              style={[styles.infoLabel, { color: theme.subText, marginTop: 8 }]}
            >
              Plan Start From:{" "}
              <Text style={{ color: theme.textColor, fontWeight: "600" }}>
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
  );
}

const styles = StyleSheet.create({
  innerBox: {
    borderRadius: 10,
    padding: 10,
  },
  textColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  sebiText: {
    fontSize: 11,
    marginTop: 12,
    opacity: 0.8,
  },
});
