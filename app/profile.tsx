import MenuItem from "@/components/common/MenuItem";
import PageHeader from "@/components/common/PageHeader";
import TopBackground from "@/components/common/TopBackground";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getProfile } from "@/redux/slice/profileSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { logOut } from "@/utils/auth";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();

  const theme = useAppTheme();

  const profile = useSelector((state: RootState) => state.profile.profile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <TopBackground />

      <View style={styles.inner}>
        <PageHeader
          title=""
          rightIcon="edit-3"
          onRightPress={() => console.log("Edit pressed")}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=3" }}
              style={styles.avatar}
            />

            <ThemedText type="title">
              {profile?.fName} {profile?.lName}
            </ThemedText>
            <ThemedText style={styles.email}>{profile?.email}</ThemedText>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            APPEARANCE
          </Text>

          <View
            style={[
              styles.itemCard,
              { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
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
              title="My Subscription"
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
              { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
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

const styles = StyleSheet.create({
  inner: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
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

  itemCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 4,
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
});
