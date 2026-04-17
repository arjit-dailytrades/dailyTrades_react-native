import PageHeader from "@/components/common/PageHeader";
import { useNavigation } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const data = [
  {
    name: "Rahul Patil",
    accuracy: "100%",
    trades: "9/10",
    plan: "Monthly",
    expiry: "25-03-2026 04:04 PM",
    status: "Active",
    image: "https://i.pravatar.cc/100",
  },
  {
    name: "Rohit Verma",
    accuracy: "25%",
    trades: "0/1",
    plan: "Monthly",
    expiry: "24-03-2026 06:28 PM",
    status: "Expired",
    image: "https://i.pravatar.cc/101",
  },
  {
    name: "Nikhil Sharma",
    accuracy: "100%",
    trades: "0/2",
    plan: "Monthly",
    expiry: "06-03-2026 04:15 PM",
    status: "Expired",
    image: "https://i.pravatar.cc/102",
  },
];

export default function Subscription() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    bg: isDark ? "#010D26" : "#ffffff",
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <PageHeader title="Subscription" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <TextInput placeholder="Search Expert Name..." style={styles.search} />

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {["Expired", "Annual", "Six Months", "Quarterly", "Monthly"].map(
            (item, index) => (
              <TouchableOpacity key={index} style={styles.filterBtn}>
                <Text style={styles.filterText}>{item}</Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>

        {/* Cards */}
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.avatar} />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>

                <View style={styles.accuracy}>
                  <Text style={styles.accuracyText}>
                    Accuracy: {item.accuracy}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.status,
                  item.status === "Active" ? styles.active : styles.expired,
                ]}
              >
                <Text
                  style={{
                    color: item.status === "Active" ? "#059669" : "#dc2626",
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View>
                <Text style={styles.label}>Trades Left</Text>
                <Text style={styles.value}>{item.trades}</Text>
              </View>

              <View>
                <Text style={styles.label}>Plan Type</Text>
                <Text style={styles.plan}>{item.plan}</Text>
              </View>

              <View>
                <Text style={styles.label}>Expiry Date</Text>
                <Text style={styles.value}>{item.expiry}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  search: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },

  filterRow: {
    paddingHorizontal: 10,
  },

  filterBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    elevation: 2,
  },

  filterText: {
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#fcfafa",
    margin: 15,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  accuracy: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 5,
    alignSelf: "flex-start",
  },

  accuracyText: {
    color: "#2563eb",
    fontSize: 12,
  },

  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  active: {
    backgroundColor: "#d1fae5",
  },

  expired: {
    backgroundColor: "#fee2e2",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 10,
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
  },

  value: {
    fontWeight: "600",
  },

  plan: {
    color: "#ef4444",
    fontWeight: "600",
  },
});
