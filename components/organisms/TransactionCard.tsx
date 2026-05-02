import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import TextAtom from "../atoms/TextAtom";
import InfoRowMolecule from "../molecules/InfoRowMolecule";
import UserInfoMolecule from "../molecules/UserInfoMolecule";
import { darkTheme, lightTheme } from "../theme/theme";

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TransactionCard = ({ item }: any) => {
  const trades = item.previousTrades + item.newTrades;

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

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
      <UserInfoMolecule
        name={item.type}
        source={item.source}
        status={item.status}
        info={item.info}
        theme={theme}
      />

      <View
        style={[styles.divider, { borderBottomColor: theme.borderColor }]}
      />

      <View>
        <InfoRowMolecule label="Order ID" value={item.orderId} theme={theme} />

        <InfoRowMolecule
          label="Amount / Trades"
          value={`Trades Left: ${trades} • ${item.type}`}
          theme={theme}
        />

        {item.amount > 0 && (
          <InfoRowMolecule
            label="Amount"
            value={`₹${item.amount}`}
            theme={theme}
          />
        )}
      </View>

      <TextAtom style={[styles.time, { color: theme.subText }]}>
        {formatDate(item.createdAt)}
      </TextAtom>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  time: {
    fontSize: 12,
    marginTop: 10,
  },
});

export default TransactionCard;
