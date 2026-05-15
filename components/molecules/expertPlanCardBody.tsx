import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface FeeDetail {
  label: string;
  value: string;
}

interface ExpertPlanCardBodyProps {
  fees?: FeeDetail[];
}

const ExpertPlanCardBody: React.FC<ExpertPlanCardBodyProps> = ({
  fees = [
    { label: "Advisor Fees", value: "₹847.46" },
    { label: "GST Payable(18%)", value: "₹5338.98" },
    { label: "Platform Fees", value: "₹0" },
  ],
}) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.innerBox, { backgroundColor: theme.innerBox }]}>
      {fees.map((fee, index) => (
        <React.Fragment key={fee.label}>
          <View style={styles.feeItem}>
            <Text style={[styles.feeLabel, { color: theme.subText }]}>
              {fee.label}
            </Text>
            <Text
              style={[
                styles.feeValue,
                { backgroundColor: theme.boxBg, color: theme.textColor },
              ]}
            >
              {fee.value}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  innerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  feeItem: {
    flex: 1,
    alignItems: "center",
  },
  feeLabel: {
    fontSize: 11,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "500",
  },
  feeValue: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",

    padding: 6,
    borderRadius: 5,
  },
});

export default ExpertPlanCardBody;
