import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AvatarAtom from "../atoms/AvatarAtom";
import BadgeAtom from "../atoms/BadgeAtom";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ExpertPlanCardHeaderProps {
  name?: string;
  accuracy?: string;
  period?: string;
  amount?: string;
  trades?: number;
  avatarUri?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const ExpertPlanCardHeader: React.FC<ExpertPlanCardHeaderProps> = ({
  name = "Sophia Gerber",
  accuracy = "28.57%",
  period = "Monthly",
  amount = "₹1000",
  trades = 8,
  avatarUri,
}) => {
  const theme = useAppTheme();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.topRow}>
      {/* Avatar + Name + Accuracy */}
      <View style={styles.advisorInfo}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: theme.iconBg,
            },
          ]}
        >
          <AvatarAtom name={name} uri="" />
        </View>

        <View style={styles.nameBlock}>
          <Text style={[styles.advisorName, { color: theme.textColor }]}>
            {name}
          </Text>
          <BadgeAtom label={`Accuracy: ${accuracy}`} type="free" />
        </View>
      </View>

      {/* Period + Amount + Trades */}
      <View style={styles.amountBlock}>
        <Text style={[styles.amount, { color: theme.textColor }]}>
          {amount}
        </Text>
        <Text style={[styles.trades, { color: theme.subText }]}>
          {trades} trades
        </Text>
      </View>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  advisorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },

  nameBlock: {
    flexShrink: 1,
  },
  advisorName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 5,
    letterSpacing: 0.2,
  },

  amountBlock: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  trades: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
});

export default ExpertPlanCardHeader;
