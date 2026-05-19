import AvatarAtom from "@/components/atoms/AvatarAtom";
import Timestamp from "@/components/atoms/Timestamp";
import UnreadDot from "@/components/atoms/UnReadDot";
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface NotificationCardHeaderProps {
  advisorName: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationCardHeader: React.FC<NotificationCardHeaderProps> = ({
  advisorName,
  isRead,
  createdAt,
}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <AvatarAtom name={advisorName} />
        <Text
          style={[styles.advisorName, { color: theme.textColor }]}
          numberOfLines={1}
        >
          {advisorName}
        </Text>
      </View>

      <View style={styles.right}>
        <UnreadDot isRead={isRead} />
        <Timestamp
          isoString={createdAt}
          style={{ color: theme.subText, fontSize: 12 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  advisorName: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  right: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
});

export default NotificationCardHeader;
