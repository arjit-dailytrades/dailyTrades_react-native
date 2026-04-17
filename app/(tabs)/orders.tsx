import AppHeader from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersScreen() {
  const orders = [
    {
      id: "1",
      symbol: "NIFTY",
      type: "BUY",
      qty: 25,
      price: 22000,
      target: 22150,
      sl: 21900,
      time: "10:45 AM",
    },
    {
      id: "2",
      symbol: "BANKNIFTY",
      type: "SELL",
      qty: 15,
      price: 48000,
      target: 47800,
      sl: 48200,
      time: "11:20 AM",
    },
  ];

  const renderOrder = ({ item }: any) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.symbol}>{item.symbol}</Text>

        <View
          style={[
            styles.badge,
            item.type === "BUY" ? styles.buyBadge : styles.sellBadge,
          ]}
        >
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.label}>Qty</Text>
          <Text style={styles.value}>{item.qty}</Text>
        </View>

        <View>
          <Text style={styles.label}>Entry</Text>
          <Text style={styles.value}>₹{item.price}</Text>
        </View>

        <View>
          <Text style={styles.label}>Target</Text>
          <Text style={styles.value}>₹{item.target}</Text>
        </View>

        <View>
          <Text style={styles.label}>SL</Text>
          <Text style={styles.value}>₹{item.sl}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.time}>{item.time}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn}>
            <Ionicons name="close-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Orders" />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 0,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  symbol: {
    fontSize: 18,
    fontWeight: "700",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  buyBadge: {
    backgroundColor: "#dcfce7",
  },

  sellBadge: {
    backgroundColor: "#fee2e2",
  },

  badgeText: {
    fontWeight: "600",
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: 11,
    color: "#6b7280",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  time: {
    fontSize: 12,
    color: "#9ca3af",
  },

  actionRow: {
    flexDirection: "row",
  },

  editBtn: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
