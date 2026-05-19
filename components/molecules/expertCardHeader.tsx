import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarAtom from "../atoms/AvatarAtom";
import BadgeAtom from "../atoms/BadgeAtom";
import IconButton from "../common/IconButton";

export default function ExpertCardHeader({
  item,
  markUnMarkAsFavorite,
  followUnFollow,
  handlePress,
  name,
}: {
  item?: any;
  markUnMarkAsFavorite?: any;
  followUnFollow?: any;
  handlePress?: () => void;
  name?: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={styles.headerRow}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handlePress}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: theme.iconBg,
              },
              item?.isSubscribed && {
                borderColor: "#4ADE80",
                borderWidth: 1.5,
              },
            ]}
          >
            <AvatarAtom name={name} height={42} width={42} />

            {item?.isSubscribed && (
              <View style={styles.connectedBadge}>
                <MaterialIcons name="done" size={14} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View>
          <Text style={[styles.name, { color: theme.textColor }]}>{name}</Text>
          <View style={[styles.accuracyBadge]}>
            <BadgeAtom
              label={`${item?.accuracy?.toFixed(2) || 0}%`}
              type="free"
            />
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <IconButton
          icon="heart"
          color={item?.favorite ? "red" : "#cfcfcf"}
          active={item?.favorite}
          onPress={() => markUnMarkAsFavorite(item.id, item?.favorite)}
        />
        <IconButton
          icon="user-add"
          color={item?.follow ? "#0068FF" : "#cfcfcf"}
          active={item?.follow}
          onPress={() => followUnFollow(item.id, item?.follow)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  profileSection: {
    flexDirection: "row",
    gap: 5,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  connectedBadge: {
    position: "absolute",
    top: -4,
    right: -3,
    backgroundColor: "#4ADE80",
    width: 20,
    height: 20,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  accuracyBadge: {
    marginTop: 4,
  },

  actionRow: {
    flexDirection: "row",
    gap: 5,
  },
});
