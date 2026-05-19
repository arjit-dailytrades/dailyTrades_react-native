import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ExpertPlanCardBody from "../molecules/ExpertPlanCardBody";
import ExpertPlanCardHeader from "../molecules/ExpertPlanCardHeader";

interface FeeDetail {
  label: string;
  value: string;
}

interface ExpertPlanCardProps {
  name?: string;
  accuracy?: string;
  period?: string;
  amount?: string;
  trades?: number;
  fees?: FeeDetail[];
  avatarUri?: string;
}

const ExpertPlanCard: React.FC<ExpertPlanCardProps> = ({
  name = "Sophia Gerber",
  accuracy = "28.57%",
  period = "Monthly",
  amount = "₹1000",
  trades = 8,
  fees = [
    { label: "Advisor Fees", value: "₹847.46" },
    { label: "GST Payable(18%)", value: "₹5338.98" },
    { label: "Platform Fees", value: "₹0" },
  ],
  avatarUri,
}) => {
  const theme = useAppTheme();

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
      <TouchableOpacity
        style={[styles.periodButton, { backgroundColor: theme.bdgBg }]}
        activeOpacity={0.8}
      >
        <Text style={styles.periodText}>{period}</Text>
      </TouchableOpacity>
      <ExpertPlanCardHeader
        name={name}
        accuracy={accuracy}
        period={period}
        amount={amount}
        trades={trades}
        avatarUri={avatarUri}
      />

      <ExpertPlanCardBody fees={fees} />
    </View>
  );
};

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
    position: "relative",
  },

  periodButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    position: "absolute",
    top: -12,
    right: 20,
  },
  periodText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default ExpertPlanCard;
