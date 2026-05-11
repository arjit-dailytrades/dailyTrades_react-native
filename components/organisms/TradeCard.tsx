import { getLtpData } from "@/services/socketService";
import React, { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import TradeCardBody from "../molecules/tradeCardBody";
import TradeCardFooter from "../molecules/tradeCardFooter";
import TradeCardHeader from "../molecules/tradeCardHeader";

const TradeCard = memo(function TradeCard({ item, onUnlock }: any) {
  const theme = useAppTheme();
  const isDark = useColorScheme() === "dark";

  const [earnProfit, setEarnProfit] = useState(0);
  const itemRef = useRef(item);

  useEffect(() => {
    itemRef.current = item;
  }, [item]);

  useEffect(() => {
    if (!item?.instrumentToken) return;

    const fetchLtp = () => {
      const data = getLtpData()[itemRef.current.instrumentToken];
      if (!data?.d?.last_price || !itemRef.current?.target) return;

      const price = data.d.last_price;
      const diff = itemRef.current.target - price;

      setEarnProfit((diff / price) * 100);
    };

    fetchLtp();
    const interval = setInterval(fetchLtp, 1000);

    return () => clearInterval(interval);
  }, [item?.instrumentToken]);

  const getExpiryDateInFormat = (updatedAt: string, expiryInDays: any) => {
    if (!updatedAt || expiryInDays == null) return "N/A";

    const date = new Date(updatedAt);
    date.setDate(date.getDate() + Number(expiryInDays));

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const advisor = item?.advisor;
  const name = `${advisor?.fName || ""} ${advisor?.lName || ""}`.trim();
  const isFree = item?.scriptPriceType === "FREE";
  const accuracy = advisor?.accuracy
    ? `${advisor.accuracy.toFixed(2)}%`
    : "N/A";

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      <TradeCardHeader
        isFree={isFree}
        name={name}
        accuracy={accuracy}
        date={getExpiryDateInFormat(item?.updatedAt, item?.expiryInDays)}
      />

      <TradeCardBody item={item} earnProfit={earnProfit} />

      <TradeCardFooter item={item} onUnlock={onUnlock} />
    </View>
  );
});

export default TradeCard;

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
