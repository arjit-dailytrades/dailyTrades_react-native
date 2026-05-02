import NoData from "@/components/common/no-data/No-data";
import TransactionCard from "@/components/organisms/TransactionCard";
import { RootState } from "@/redux/store";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import { getTransactionList } from "../redux/slice/transactionsSlice";

const PAGE_LIMIT = 10;

export default function Transactions() {
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const { transaction, loading, totalCount } = useSelector(
    (state: RootState) => state.transaction,
  );

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const isDark = scheme === "dark";

  // ─── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTransactions(1, false);
  }, []);

  // ─── Fetch helper ─────────────────────────────────────────────────────────────
  const fetchTransactions = useCallback(
    async (pageNum: number, isLoadMore: boolean) => {
      if (!isLoadMore) setPage(1);

      await dispatch(
        getTransactionList({
          page: pageNum,
          limit: PAGE_LIMIT,
          sortType: "desc",
          sortBy: "createdAt",
          source: "ALL",
        }) as any,
      );

      setRefreshing(false);
      setLoadingMore(false);
    },
    [dispatch],
  );

  // ─── Pull to refresh ──────────────────────────────────────────────────────────
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTransactions(1, false);
  }, [fetchTransactions]);

  // ─── Load next page ───────────────────────────────────────────────────────────
  const onEndReached = useCallback(() => {
    const hasMore = transaction.length < (totalCount ?? 0);
    if (loadingMore || loading || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchTransactions(nextPage, true);
  }, [
    loadingMore,
    loading,
    transaction.length,
    totalCount,
    page,
    fetchTransactions,
  ]);

  // ─── Footer spinner ───────────────────────────────────────────────────────────
  const ListFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={isDark ? "#fff" : "#333"} />
      </View>
    );
  };

  // ─── Empty state ──────────────────────────────────────────────────────────────
  const ListEmpty = () => {
    if (loading && transaction.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={isDark ? "#fff" : "#333"} />
        </View>
      );
    }
    return <NoData />;
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: isDark ? "#0f0f0f" : "#f9f9f9" }]}
      edges={["top"]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <PageHeader title="Transactions" />

      <FlatList
        data={transaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.list,
          transaction.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={<ListEmpty />}
        ListFooterComponent={<ListFooter />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? "#fff" : "#333"}
          />
        }
        renderItem={({ item }) => <TransactionCard item={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  listEmpty: {
    flexGrow: 1, // lets empty / loading states center vertically
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
