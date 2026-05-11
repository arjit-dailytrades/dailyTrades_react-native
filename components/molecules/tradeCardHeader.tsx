import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarAtom from "../atoms/AvtarAtom";
import BadgeAtom from "../atoms/BadgeAtom";

export default function TradeCardHeader({
  isFree,
  name,
  date,
  accuracy,
}: {
  isFree: boolean;
  name: string;
  date: any;
  accuracy: string;
}) {
  const theme = useAppTheme();
  return (
    <View style={styles.headerRow}>
      {/* LEFT */}
      <TouchableOpacity activeOpacity={0.9} style={{ flex: 1 }}>
        <View style={styles.profileSection}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.iconBg }]}>
            <AvatarAtom name={name} />
          </View>

          {/* IMPORTANT */}
          <View style={{ flex: 1 }}>
            <View style={styles.profile}>
              <Text
                style={[styles.name, { color: theme.textColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
              <BadgeAtom
                label={isFree ? "FREE" : "PAID"}
                type={isFree ? "free" : "paid"}
                fontSize={8}
              />
            </View>
            <View style={{ marginTop: 4 }}>
              <BadgeAtom label={`Accuracy: ${accuracy}`} fontSize={8} />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* RIGHT */}
      <View style={styles.rightSection}>
        {/* <CommonButton
          title="Following"
          iconName={"user-add"}
          buttonWidth={90}
          fontsize={10}
          iconSize={12}
        /> */}
        <Text style={[styles.date, { color: theme.textColor }]}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  profileSection: {
    flexDirection: "row",
    flex: 1,
    paddingRight: 8,
  },

  rightSection: {
    alignItems: "center",
    justifyContent: "flex-start",
    minWidth: 100,
    gap: 1,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    gap: 6,
  },
  date: {
    fontSize: 12,
  },
});
