import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarAtom from "../atoms/AvatarAtom";
import IconButton from "../common/IconButton";

export default function FavoriteFollowExpertCardHeader({
  item,
  handlePress,
  name,
}: {
  item: any;
  handlePress: () => void;
  name: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <View style={styles.profileSection}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: theme.iconBg,
              },
            ]}
          >
            <AvatarAtom name={name} />
          </View>

          <Text style={[styles.name, { color: theme.textColor }]}>{name}</Text>
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        {item?.favourite && <IconButton icon="heart" active />}

        {item?.follow && <IconButton icon="user-add" active />}
      </View>
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
    marginRight: 8,
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
