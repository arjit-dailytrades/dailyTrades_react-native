import { segmentMapping, statusMapping } from "@/constants/data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { downloadResearchReport } from "@/redux/slice/expertSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { format } from "date-fns";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BadgeAtom from "../atoms/BadgeAtom";
import { BoxAtom } from "../atoms/BoxAtom";
import GlowButton from "../common/GlowButton";

type StatusColor = "success" | "error" | "neutral";

function getStatusColor(status: string): StatusColor {
  if (status === "TARGET_HIT") return "success";
  if (status === "STOP_LOSS_HIT" || status === "EXPIRED") return "error";
  return "neutral";
}

export default function ExpertPastPerformanceCard({ item }: { item: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useAppTheme();

  const [isDownloadId, setIsDownloadingId] = useState<string | null>(null);

  const { isDownloading } = useSelector((state: RootState) => state.expert);

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
        id: record._id,
        advisor: { fName: "", lName: "" },
        record: record,
      }),
    ).finally(() => {
      setIsDownloadingId(null);
    });
  };

  const statusColorKey = getStatusColor(item?.status);

  const statusColor =
    statusColorKey === "success"
      ? theme.success
      : statusColorKey === "error"
        ? theme.error
        : theme.error;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.glassBorder },
      ]}
    >
      {/* Top Section */}
      <View style={styles.headerRow}>
        <View style={styles.profileSection}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Text
                style={[styles.name, { color: theme.textColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item?.title}
              </Text>
              <BadgeAtom
                label={item?.scriptPriceType}
                type={item?.scriptPriceType === "PAID" ? "paid" : "free"}
              />
            </View>

            <Text style={[styles.subText, { color: theme.subText }]}>
              {segmentMapping[item?.segment] || item?.segment}
            </Text>
          </View>
        </View>

        <View style={styles.callsSection}>
          <Text style={[styles.callCount, { color: statusColor }]}>
            {statusMapping[item?.status] ?? item?.status}
          </Text>
          <Text style={[styles.callLabel, { color: theme.subText }]}>
            {getFormattedDate()}
          </Text>
        </View>
      </View>

      {/* Price Info Row */}
      <View style={styles.row}>
        <BoxAtom
          label="Min/Max Entry"
          value={`₹ ${item?.entryMin ?? "-"} - ${item?.entryMax ?? "-"}`}
        />
        <BoxAtom
          label="Stop Loss"
          value={`₹ ${item?.stopLoss ?? "-"}`}
          valueColor={item?.stopLossHit ? theme.error : undefined}
        />
        <BoxAtom
          label="Target"
          value={`₹ ${item?.target ?? "-"}`}
          valueColor={item?.targetHit ? theme.success : undefined}
        />
      </View>

      <GlowButton
        handleClick={() => handleDownload(item)}
        title="Download"
        buttonWidth="100%"
        loading={isDownloadId === item.id && isDownloading}
      />
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
    paddingBottom: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    borderStyle: "dashed",
  },
  profileSection: {
    flexDirection: "row",
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
    maxWidth: "60%",
  },
  subText: {
    fontSize: 12,
    marginTop: 2,
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
    marginTop: 12,
    gap: 8,
  },
});
