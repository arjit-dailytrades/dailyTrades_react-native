import { downloadResearchReport } from "@/redux/slice/expertSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { format } from "date-fns";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import GlowButton from "../common/GlowButton";

interface AdvisorMapping {
  [key: string]: string;
}

export default function ExpertPastPerformanceCard({ item }: { item: any }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch<AppDispatch>();
  const [isDownloadId, setIsDownloadingId] = useState(null);
  const { fileUri, isDownloading } = useSelector(
    (state: RootState) => state.expert,
  );

  const theme = {
    cardBg: isDark ? "#FFFFFF0D" : "#ffffff",
    borderColor: isDark ? "#FFFFFF1A" : "#0D0D0D1A",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666666",
    accuracyBg: isDark ? "rgba(59, 130, 246, 0.15)" : "#DBEAFE",
    badgeBg: isDark ? "#1A2A3A" : "#66666617",
    badgeText: isDark ? "#FFFFFF80" : "#050505c2",
  };

  const statusMapping: AdvisorMapping = {
    EXPIRED: "Trade Expired",
    TARGET_MET: "Target Hit",
    STOP_LOSS_MET: "Stop Loss Hit",
  };

  const handlePress = () => {
    router.push({
      pathname: "/expertPastPerformance",
      params: {
        advisorId: item?.id,
      },
    });
  };

  const getFormattedDate = () => {
    if (item?.scriptExpired && item?.scriptExpiredAt) {
      return format(new Date(item.scriptExpiredAt), "dd MMM yyyy, hh:mm a");
    }
    if (item?.targetHit && item?.targetHitAt) {
      return format(new Date(item.targetHitAt), "dd MMM yyyy, hh:mm a");
    }
    if (item?.stopLossHitAt) {
      return format(new Date(item.stopLossHitAt), "dd MMM yyyy, hh:mm a");
    }
    return "";
  };
  const handleDownload = (record: any) => {
    setIsDownloadingId(record.id);
    dispatch(
      downloadResearchReport({
        id: record.id,
        advisor: { fName: "", lName: "" },
        record: record,
      }),
    );
  };
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      {/* Top Section */}
      <View style={styles.headerRow}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handlePress}>
            <View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                },
                item?.isSubscribed && {
                  borderColor: "#4ADE80",
                  borderWidth: 1.5,
                },
              ]}
            >
              <Image
                source={require("../../assets/images/expert.png")}
                style={styles.avatar}
              />
            </View>
          </TouchableOpacity>

          <View>
            <Text
              style={[styles.name, { color: theme.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.title}
            </Text>
            <View
              style={[
                styles.accuracyBadge,
                { backgroundColor: theme.accuracyBg },
              ]}
            >
              <Text style={styles.accuracyText}>{item?.scriptPriceType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.callsSection}>
          <Text style={[styles.callCount, { color: theme.text }]}>
            {statusMapping[item?.status]}
          </Text>
          <Text style={[styles.callLabel, { color: theme.subText }]}>
            {getFormattedDate()}
          </Text>
        </View>
      </View>

      <View>
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>Min/Max Entry</Text>
            <Text
              style={[
                styles.value,
                { backgroundColor: theme.badgeBg, color: theme.badgeText },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              ₹ {item?.entryMin ?? "-"} - {item?.entryMax ?? "-"}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Stop loss</Text>
            <Text
              style={[
                styles.value,
                { backgroundColor: theme.badgeBg, color: theme.badgeText },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              ₹ {item?.stopLoss ?? "-"}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Target</Text>
            <Text
              style={[
                styles.value,
                { backgroundColor: theme.badgeBg, color: theme.badgeText },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              ₹ {item?.target ?? "-"}
            </Text>
          </View>
        </View>
        <GlowButton
          handleClick={() => handleDownload(item)}
          title="Download"
          buttonWidth={"100%"}
          loading={isDownloadId === item.id && isDownloading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginTop: 16,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    borderStyle: "dashed",
  },
  profileSection: {
    flexDirection: "row",
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
    maxWidth: "90%",
  },
  accuracyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  accuracyText: {
    color: "#3B82F6",
    fontSize: 8,
    fontWeight: "bold",
  },
  callsSection: {
    alignItems: "flex-end",
  },
  callCount: {
    fontSize: 12,
    fontWeight: "700",
  },
  callLabel: {
    fontSize: 10,
    textAlign: "right",
    width: 90,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  box: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
  },

  label: {
    color: "#A0AEC0",
    fontSize: 12,
    marginBottom: 6,
  },

  value: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    textAlign: "center",
    flexShrink: 1,
    maxWidth: "100%",
  },
});
