import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ExactHeaderProps {
  profileImageUri?: string;
  onProfilePress?: () => void;
  onPremiumPress?: () => void;
  onSearchPress?: () => void;
  onBellPress?: () => void;
}

export const CommonHeader: React.FC<ExactHeaderProps> = ({
  profileImageUri = "https://via.placeholder.com/150",
  onProfilePress,
  onPremiumPress,
  onSearchPress,
  onBellPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Profile Section */}
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
        <View style={styles.profileCircle}>
          <Image source={{ uri: profileImageUri }} style={styles.image} />
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        {/* Premium Button */}
        <TouchableOpacity
          style={styles.premiumButton}
          onPress={onPremiumPress}
          activeOpacity={0.7}
        >
          <View style={styles.crownBadge}>
            <MaterialCommunityIcons name="crown" size={16} color="#020617" />
          </View>
          <Text style={styles.premiumText}>Premium Order</Text>
        </TouchableOpacity>

        {/* Action Icons */}
        <TouchableOpacity style={styles.iconCircle} onPress={onSearchPress}>
          <MaterialCommunityIcons name="magnify" size={18} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconCircle} onPress={onBellPress}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={18}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileCircle: {
    width: 35,
    height: 35,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    height: 35,
  },
  crownBadge: {
    backgroundColor: "#FFD700",
    width: 20,
    height: 20,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  premiumText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
});
