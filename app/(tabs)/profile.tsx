import AppHeader from "@/components/AppHeader";
import { ThemedText } from "@/components/themed-text";
import { logOut } from "@/utils/auth";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />

          <ThemedText type="title">Rahul Sharma</ThemedText>
          <ThemedText style={styles.email}>rahul@email.com</ThemedText>

          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color="#fff" />
            <ThemedText style={styles.editText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.menu}>
          <MenuItem icon="person-outline" title="Account Info" />
          <MenuItem icon="lock-closed-outline" title="Change Password" />
          <MenuItem icon="notifications-outline" title="Notifications" />
          <MenuItem icon="help-circle-outline" title="Help & Support" />
          <MenuItem icon="settings-outline" title="Settings" />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={logOut}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MenuItem({ icon, title }: any) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color="#6366f1" />
        <ThemedText style={styles.menuText}>{title}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  profileCard: {
    alignItems: "center",
    padding: 25,
    margin: 20,
    backgroundColor: "#fff",
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

  menu: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 14,
    paddingVertical: 5,
    elevation: 2,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuText: {
    fontSize: 15,
  },

  logout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 25,
    padding: 14,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
