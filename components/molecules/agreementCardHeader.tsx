import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarAtom from "../atoms/AvtarAtom";

export default function AgreementCardHeader({ item }: { item: any }) {
  const theme = useAppTheme();

  const firstName = item?.advisor?.fName || "";
  const lastName = item?.advisor?.lName || "";
  console.log(item, "=============header");

  const name = `${firstName} ${lastName}`.trim();
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.profileSection}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: theme.iconBg,
              },
            ]}
          >
            <AvatarAtom
              //   uri={item?.advisorDetails?.dp}
              name={name}
            />
          </View>
          <View>
            <Text style={[styles.name, { color: theme.textColor }]}>
              {`${item?.advisor?.fName} ${item?.advisor?.lName}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    gap: 6,
  },
});
