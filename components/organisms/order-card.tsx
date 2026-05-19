import { useAppTheme } from "@/hooks/use-app-theme";

import React from "react";
import { StyleSheet, View } from "react-native";
import { OrderCardBody } from "../molecules/OrderCardBody";
import { OrderCardFooter } from "../molecules/OrderCardFooter";
import { OrderCardHeader } from "../molecules/OrderCardHeader";

export const OrderCard = ({ item }: { item: any }) => {
  const isSuccess = item.status === "Success" || item.status === "SUCCESS";
  const isBuy = item.side === "BUY";
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      <OrderCardHeader item={item} isSuccess={isSuccess} />
      <OrderCardBody item={item} isBuy={isBuy} />
      <OrderCardFooter item={item} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
});
