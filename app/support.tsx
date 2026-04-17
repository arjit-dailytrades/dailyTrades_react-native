import PageHeader from "@/components/common/PageHeader";
import SupportDetailModal from "@/components/support/SupportDetailModal";
import SupportForm from "@/components/support/SupportForm";
import { getSupportList } from "@/redux/slice/supportSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Support() {
  const [openForm, setOpenForm] = useState(false);
  const [isDetailVisible, setDetailVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState({});
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { supports, loading } = useSelector((state: any) => state.support);
  const handleViewDetails = (ticket: any) => {
    setDetailVisible(true);
    setSelectedTicket(ticket);
  };
  useEffect(() => {
    dispatch(getSupportList({ page: 1 }) as any);
  }, []);
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
    const statusColor =
      item.status === "RESOLVED"
        ? colors.success
        : item.status === "PENDING"
          ? colors.warning
          : colors.primary;

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.cardHeader}>
          {/* Title with Truncation */}
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          {/* Status instead of Open button */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}20` },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status || "Pending"}
            </Text>
          </View>
        </View>

        {/* Comment with Truncation (...) */}
        <Text
          style={[styles.comment, { color: colors.subtext }]}
          numberOfLines={2}
        >
          {item.userComment}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.subtext}
            />
            <Text style={[styles.date, { color: colors.subtext }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {/* Arrow Icon triggers Form/Action */}
          <TouchableOpacity
            onPress={() => handleViewDetails(item)}
            style={[
              styles.arrowCircle,
              { backgroundColor: `${colors.primary}10` },
            ]}
          >
            <Ionicons name="arrow-forward" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <PageHeader title="Help & Support" />

      <View style={styles.hero}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setOpenForm(true)}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addText}>Create Ticket</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={supports?.records || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      <SupportForm
        visible={openForm}
        onClose={() => {
          setOpenForm(false);
          dispatch(getSupportList({ page: 1 }) as any);
        }}
      />
      <SupportDetailModal
        visible={isDetailVisible}
        onClose={() => setDetailVisible(false)}
        data={selectedTicket}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  heroText: { fontSize: 22, fontWeight: "800" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    width: "100%",
  },
  addText: { color: "#fff", fontWeight: "600", marginLeft: 4 },
  listPadding: { paddingHorizontal: 10, paddingBottom: 30 },
  card: {
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 8 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  comment: { fontSize: 13, lineHeight: 18, marginBottom: 15 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  dateRow: { flexDirection: "row", alignItems: "center" },
  date: { fontSize: 12, fontWeight: "500", marginLeft: 4 },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
