import PageHeader from "@/components/common/PageHeader";
import TopBackground from "@/components/common/TopBackground";
import AgreementCard from "@/components/organisms/AgreementCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getAgreementList } from "@/redux/slice/agreementSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  useColorScheme
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function AgreementScreen() {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useDispatch<AppDispatch>();
  const { agreement, totalCount, loading } = useSelector(
    (state: RootState) => state.agreement,
  );

  const fetchSupport = async (pageNum: number, isLoadMore = false) => {
    if (!isLoadMore) setPage(1);

    await dispatch(getAgreementList({ page: pageNum }) as any);

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
    const hasMore = agreement?.length < (totalCount || 0);

    if (loadingMore || loading || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);

    fetchSupport(nextPage, true);
  };

  console.log(agreement, "==========agreement");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <PageHeader title="Accepted Agreement" showBack={true} />
      <TopBackground />

      <FlatList
        data={agreement}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => <AgreementCard item={item} />}
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
