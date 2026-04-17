import PageHeader from "@/components/common/PageHeader";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Transactions() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const transactions = [
    {
      id: "1",
      type: "deposit",
      amount: 5000,
      date: "12 Mar 2026",
      status: "Success",
    },
    {
      id: "2",
      type: "withdraw",
      amount: 2000,
      date: "10 Mar 2026",
      status: "Pending",
    },
    {
      id: "3",
      type: "deposit",
      amount: 10000,
      date: "05 Mar 2026",
      status: "Success",
    },
  ];

  const colors = {
    bg: isDark ? "#010D26" : "#ffffff",
    card: isDark ? "#161B2C" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666",
    inputBg: isDark ? "#1F2937" : "#FFF",
    accent: "#3B82F6",
    border: isDark ? "#374151" : "#E5E7EB",
    glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    subtext: isDark ? "#94A3B8" : "#64748B",
    primary: "#6366F1",
    success: "#22C55E",
    warning: "#F59E0B",
  };

  const renderItem = ({ item }: any) => {
    const isDeposit = item.type === "deposit";

    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: isDeposit ? "#dcfce7" : "#fee2e2" },
            ]}
          >
            <Ionicons
              name={isDeposit ? "arrow-down" : "arrow-up"}
              size={20}
              color={isDeposit ? "#16a34a" : "#dc2626"}
            />
          </View>

          <View>
            <Text style={styles.title}>
              {isDeposit ? "Deposit" : "Withdraw"}
            </Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.amount}>₹{item.amount}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <PageHeader title="Transaction" />
      {/* List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fcfafa",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
  },

  date: {
    fontSize: 12,
    color: "#6b7280",
  },

  right: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 16,
    fontWeight: "700",
  },

  status: {
    fontSize: 12,
    color: "#6b7280",
  },
});
