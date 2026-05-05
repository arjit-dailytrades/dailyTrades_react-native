import PageHeader from "@/components/common/PageHeader";
import SupportCard from "@/components/support/SupportCard";
import SupportDetailModal from "@/components/support/SupportDetailModal";
import SupportForm from "@/components/support/SupportForm";
import { getSupportList } from "@/redux/slice/supportSlice";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const dispatch = useDispatch();

  const { supports, loading, totalCount } = useSelector(
    (state: any) => state.support,
  );
  const handleViewDetails = (ticket: any) => {
    setDetailVisible(true);
    setSelectedTicket(ticket);
  };

  const fetchSupport = async (pageNum: number, isLoadMore = false) => {
    if (!isLoadMore) setPage(1);

    await dispatch(getSupportList({ page: pageNum }) as any);

    setRefreshing(false);
    setLoadingMore(false);
  };
  useEffect(() => {
    fetchSupport(1);
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    fetchSupport(1);
  };
  const onEndReached = () => {
    const hasMore = supports.length < (totalCount || 0);

    if (loadingMore || loading || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);

    fetchSupport(nextPage, true);
  };
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <PageHeader title="Help & Support" showBack={true} />

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
        data={supports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SupportCard
            item={item}
            colors={colors}
            onPress={() => handleViewDetails(item)}
          />
        )}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" /> : null
        }
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
