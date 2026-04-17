import { getLtpData } from "@/services/socketService";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import CommonButton from "../common/CommonButton";
import GlowButton from "../common/GlowButton";

const TradeCard = memo(function TradeCard({ item, onUnlock }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const advisor = item.advisor;
  const isFree = item.scriptPriceType === "FREE";

  const [earnProfit, setEarnProfit] = useState(0);
  const [ltp, setLtp] = useState<any>(null);
  const [risk, setRisk] = useState(0);
  const [reward, setReward] = useState(0);
  const [rewardPercent, setRewardPercent] = useState(0);

  const [expiryInfo, setExpiryInfo] = useState<any>({
    expired: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expiryDate: null,
  });

  const itemRef = useRef(item);
  useEffect(() => {
    itemRef.current = item;
  }, [item]);

  const calculateTradeExpiry = useCallback(() => {
    const currentItem = itemRef.current;
    if (!currentItem?.updatedAt) {
      return {
        expired: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expiryDate: null,
      };
    }

    const {
      updatedAt,
      expiryInDays = 0,
      xh = 0,
      xm = 0,
      stopLossHit,
      targetHit,
    } = currentItem;

    if (stopLossHit || targetHit) {
      return {
        expired: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expiryDate: null,
      };
    }

    const createdDate = new Date(updatedAt);
    const expiryDate = new Date(createdDate);

    if (Number(expiryInDays) === 0) {
      expiryDate.setHours(23, 59, 59, 999);
    } else {
      expiryDate.setDate(expiryDate.getDate() + Number(expiryInDays));
      expiryDate.setHours(expiryDate.getHours() + Number(xh));
      expiryDate.setMinutes(expiryDate.getMinutes() + Number(xm));
    }

    const diff = expiryDate.getTime() - Date.now();

    if (diff <= 0) {
      return {
        expired: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expiryDate,
      };
    }

    return {
      expired: false,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expiryDate,
    };
  }, []);

  useEffect(() => {
    setExpiryInfo(calculateTradeExpiry());
    const timer = setInterval(() => {
      setExpiryInfo(calculateTradeExpiry());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTradeExpiry]);

  // LTP polling
  useEffect(() => {
    if (!item?.instrumentToken) return;

    const fetchLtp = () => {
      const data = getLtpData()[itemRef.current.instrumentToken];
      if (!data?.d?.last_price) return;

      const price = data.d.last_price;
      setLtp(data);

      const rewardVal = itemRef.current?.target
        ? itemRef.current.target - price
        : 0;
      const riskVal = itemRef.current?.stopLoss
        ? price - itemRef.current.stopLoss
        : 0;
      setReward(rewardVal);
      setRisk(riskVal);

      const total = rewardVal + riskVal;
      setRewardPercent(total ? (rewardVal * 100) / total : 0);
    };

    fetchLtp();
    const interval = setInterval(fetchLtp, 1000);
    return () => clearInterval(interval);
  }, [item?.instrumentToken]);

  // Earn profit from LTP
  useEffect(() => {
    if (!ltp?.d?.last_price || !itemRef.current?.target) {
      setEarnProfit(0);
      return;
    }
    const price = ltp.d.last_price;
    const diff = itemRef.current.target - price;
    setEarnProfit((diff / price) * 100);
  }, [ltp]);

  // Helpers
  const getExpiryDateInFormat = (updatedAt: string, expiryInDays: any) => {
    if (!updatedAt || expiryInDays === undefined || expiryInDays === null)
      return "N/A";
    const date = new Date(updatedAt);
    date.setDate(date.getDate() + Number(expiryInDays));
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Theme
  const theme = {
    cardBg: isDark ? "transparent" : "#ffffff",
    boxBg: isDark ? "#FFFFFF0D" : "#f8f9fa",
    textColor: isDark ? "#ffffff" : "#000000",
    subText: isDark ? "#fff" : "#000",
    borderColor: isDark ? "#FFFFFF1A" : "#0D0D0D1A",
    badgeBgFree: isDark ? "#15397C" : "#d6e3fa",
    badgeBgPaid: isDark ? "#00ff8c" : "#cefbe6",
    detailBg: isDark ? "#FFFFFF0F" : "#87868617",
    chatBtnBorder: isDark ? "#FFFFFF33" : "#000",
    valColor: isDark ? "#FFFFFF80" : "#FFFFFF80",
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.userRow}>
          <Image
            source={require("../../assets/images/expert.png")}
            style={styles.avatar}
            contentFit="cover"
          />
          <View>
            <View style={styles.advisorProfile}>
              <Text style={[styles.userName, { color: theme.textColor }]}>
                {`${advisor?.fName} ${advisor?.lName}`}
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isFree
                      ? theme.badgeBgFree
                      : theme.badgeBgPaid,
                  },
                ]}
              >
                <Text style={[styles.badgeText, { color: theme.textColor }]}>
                  {isFree ? "FREE" : "PAID"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={[styles.date, { color: theme.textColor }]}>
          {getExpiryDateInFormat(item?.updatedAt, item?.expiryInDays)}
        </Text>
      </View>

      <View style={[styles.details, { backgroundColor: theme.detailBg }]}>
        {/* Symbol row */}
        <View style={styles.rowBetween}>
          <View>
            {item?.openedScript ? (
              <Text
                style={[
                  styles.symbol,
                  { color: theme.textColor, lineHeight: 35 },
                ]}
              >
                {item?.title}
              </Text>
            ) : (
              <Image
                source={require("../../assets/images/scriptBlur.png")}
                style={{ height: 35, width: 100 }}
                contentFit="cover"
              />
            )}
          </View>
          <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
            <TouchableOpacity
              style={[styles.chatBtn, { borderColor: theme.chatBtnBorder }]}
            >
              <AntDesign name="wechat-work" size={12} color={theme.textColor} />
              <Text style={[styles.chatText, { color: theme.textColor }]}>
                Chat Support
              </Text>
            </TouchableOpacity>
            <Feather name="info" size={16} color={theme.textColor} />
          </View>
        </View>

        {/* Entry / SL / Target boxes */}
        <View style={styles.row}>
          <Box
            label={item?.openedScript ? "Entry" : "EXP Margin Required"}
            value={
              item?.openedScript ? `₹${item.entryMin}-₹${item.entryMax}` : ""
            }
            theme={theme}
            height={96}
            direction="column"
            justify="center"
            labelSize={18}
          />
          <View style={{ flexDirection: "column", gap: 10 }}>
            {/* ✅ Fixed: Stop Loss shows stopLoss, Target shows target */}
            <Box
              label="Stop Loss :"
              value={`₹${item.stopLoss}`}
              theme={theme}
              height={43}
              direction="row"
              justify="space-between"
              labelSize={12}
            />
            <Box
              label="Target :"
              value={`₹${item.target}`}
              theme={theme}
              height={43}
              direction="row"
              justify="space-between"
              labelSize={12}
            />
          </View>
        </View>

        {/* Potential return */}
        <View>
          <Text style={styles.profit}>
            <AntDesign name="line-chart" size={20} color="#3EBE32" /> Potential
            Return {earnProfit.toFixed(2)}%
          </Text>
        </View>

        {/* Expiry countdown */}
        {/* {!expiryInfo?.expired &&
          (expiryInfo?.days > 0 ||
            expiryInfo?.hours > 0 ||
            expiryInfo?.minutes > 0) && (
            <Text style={styles.expiry}>
              Expires in: {expiryInfo.days}d {expiryInfo.hours}h{" "}
              {expiryInfo.minutes}m {expiryInfo.seconds}s
            </Text>
          )}
        {expiryInfo?.expired && (
          <Text style={[styles.expiry, { color: "#FF4D4D" }]}>Expired</Text>
        )} */}

        {/* Action Buttons */}
        <View style={styles.bottom}>
          <CommonButton title="Research Report" buttonWidth={100} />
          <GlowButton
            title={
              !item?.openedScript
                ? "Open"
                : !advisor?.isSubscribed
                  ? "Subscription"
                  : "Place Order"
            }
            handleClick={() => onUnlock(item)}
            buttonWidth={100}
          />
        </View>
      </View>
    </View>
  );
});

export default TradeCard;

function Box({
  label,
  value,
  theme,
  height,
  direction,
  justify,
  labelSize,
}: any) {
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: theme.boxBg,
          height,
          width: 125,
          flexDirection: direction,
          justifyContent: justify,
        },
      ]}
    >
      <Text
        style={[styles.boxLabel, { color: theme.subText, fontSize: labelSize }]}
      >
        {label}
      </Text>
      <Text
        style={[styles.boxValue, { color: theme.valColor }]}
        numberOfLines={1}
      >
        {value}
      </Text>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  advisorProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  userName: {
    fontSize: 12,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
  },
  details: {
    padding: 16,
    borderRadius: 15,
    marginTop: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatBtn: {
    borderWidth: 1,
    borderRadius: 100,
    padding: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  chatText: {
    fontSize: 10,
    fontWeight: "600",
  },
  symbol: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    gap: 5,
  },
  box: {
    padding: 10,
    borderRadius: 16,
    alignItems: "center",
    gap: 2,
  },
  boxLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  boxValue: {
    fontSize: 10,
    fontWeight: "500",
  },
  profit: {
    color: "#3EBE32",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  expiry: {
    color: "#FFA500",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  bottom: {
    flexDirection: "row",
    marginTop: 18,
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
