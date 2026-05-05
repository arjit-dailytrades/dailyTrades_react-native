import PageHeader from "@/components/common/PageHeader";
import { ThemedText } from "@/components/themed-text";
import { getProfile } from "@/redux/slice/profileSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { logOut } from "@/utils/auth";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();

  const systemTheme = useColorScheme();
  const isDark = systemTheme === "dark";
  const { profile } = useSelector((state: RootState) => state.profile);
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const theme = {
    bg: isDark ? "#060B1A" : "#F3F4F6",
    card: isDark ? "rgba(255,255,255,0.05)" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666666",
    border: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* <AppHeader title="Profile" /> */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={require("../../assets/images/topBG.png")}
          style={styles.bgImage}
          contentFit="cover"
        />
      </View>
      <PageHeader
        title=""
        rightIcon="edit-3"
        onRightPress={() => console.log("Edit pressed")}
      />
      <View style={[styles.container]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileCard}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=3" }}
              style={styles.avatar}
            />

            <ThemedText type="title">
              {profile?.profile?.fName} {profile?.profile?.lName}
            </ThemedText>
            <ThemedText style={styles.email}>{profile?.email}</ThemedText>

            {/* <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <ThemedText style={styles.editText}>Edit Profile</ThemedText>
            </TouchableOpacity> */}
          </View>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            APPEARANCE
          </Text>

          <View
            style={[
              styles.itemCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <MenuItem
              icon="person-outline"
              title="Profile"
              route="/userProfile"
              theme={theme}
            />
            <MenuItem
              icon="settings-outline"
              title="Risk Profile"
              route="/risk-profile"
              theme={theme}
            />
            <MenuItem
              icon="person-add-outline"
              title="Following Advisor"
              route="/following-advisor"
              theme={theme}
            />
            <MenuItem
              icon="person-add-outline"
              title="Favorite Advisor"
              route="/favorite-advisor"
              theme={theme}
            />
            <MenuItem
              icon="document-outline"
              title="Accepted Agreement"
              route="/agreement"
              theme={theme}
            />

            <MenuItem
              icon="trending-up-outline"
              title="My Trades"
              route="/myTrades"
              theme={theme}
            />

            <MenuItem
              icon="bag-handle-outline"
              title="My Orders"
              route="/myOrders"
              theme={theme}
            />

            <MenuItem
              icon="diamond-outline"
              title="Premium Tools"
              route="/premiumTools"
              theme={theme}
            />

            <MenuItem
              icon="swap-horizontal-outline"
              title="Transactions"
              route="/transactions"
              theme={theme}
            />

            <MenuItem
              icon="card-outline"
              title="Subscription"
              route="/subscription"
              theme={theme}
            />

            <MenuItem
              icon="help-circle-outline"
              title="Help & Support"
              route="/support"
              theme={theme}
              isLast={true}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            ACCOUNT
          </Text>

          <TouchableOpacity
            style={[
              styles.itemCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => logOut()}
          >
            <View style={styles.itemRow}>
              <View style={styles.iconLabel}>
                <MaterialIcons name="logout" size={22} color="#FF4D4D" />
                <Text style={[styles.itemText, { color: "#FF4D4D" }]}>
                  Logout
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.subText}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// MenuItem component with theme support
function MenuItem({ icon, title, route, theme, isLast }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        { borderBottomColor: theme.border, borderBottomWidth: isLast ? 0 : 1 },
      ]}
      onPress={() => router.push(route)}
    >
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color="#6366f1" />
        <ThemedText style={[styles.menuText, { color: theme.text }]}>
          {title}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.subText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 15,
    textTransform: "uppercase",
  },

  profileCard: {
    alignItems: "center",
    padding: 25,
    margin: 20,
    borderRadius: 16,
    elevation: 3,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },

  email: {
    color: "#6b7280",
    marginTop: 4,
  },

  editBtn: {
    flexDirection: "row",
    backgroundColor: "#6366f1",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },

  editText: {
    color: "#fff",
  },
  itemCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 4, // Horizontal padding MenuItem ke liye adjust ki gayi
    marginBottom: 10,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
