import PageHeader from "@/components/common/PageHeader";
import { SubscriptionCard } from "@/components/subscription/subscription-card";
import SubscriptionFilters from "@/components/subscription/subsctiption-filter";
import { getSubscriptionList } from "@/redux/slice/subscriptionSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const PAGE_SIZE = 10;

// ─── Skeleton Card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonLines}>
        <View style={[styles.skeletonLine, { width: "60%" }]} />
        <View style={[styles.skeletonLine, { width: "40%", marginTop: 8 }]} />
      </View>
      <View style={styles.skeletonBadge} />
    </Animated.View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Subscriptions Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filters or search term.
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Subscription() {
  const { subscription, loading } = useSelector(
    (state: RootState) => state.subscription,
  );
  const dispatch = useDispatch<AppDispatch>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [activeFilter, setActiveFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    dispatch(getSubscriptionList({ page, limit: PAGE_SIZE })).then(
      (action: any) => {
        const items = action?.payload?.data ?? [];
        if (items.length < PAGE_SIZE) setHasMore(false);
        setLoadingMore(false);
        setRefreshing(false);
        isFirstLoad.current = false;
      },
    );
  }, [dispatch, page]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    if (page === 1) {
      dispatch(getSubscriptionList({ page: 1, limit: PAGE_SIZE })).then(
        (action: any) => {
          const items = action?.payload?.data ?? [];
          if (items.length < PAGE_SIZE) setHasMore(false);
          setRefreshing(false);
        },
      );
    } else {
      setPage(1);
    }
  }, [dispatch, page]);

  const onEndReached = useCallback(() => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);
    setPage((prev) => prev + 1);
  }, [loadingMore, hasMore, loading]);

  const filteredData = (subscription ?? []).filter((item: any) => {
    const matchesFilter = activeFilter
      ? item.status?.toLowerCase() === activeFilter.toLowerCase()
      : true;
    const matchesSearch = searchText
      ? item.name?.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  const renderHeader = () => (
    <SubscriptionFilters
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      searchText={searchText}
      setSearchText={setSearchText}
    />
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text style={styles.footerText}>Loading more…</Text>
        </View>
      );
    }
    if (!hasMore && filteredData.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <View style={styles.footerLine} />
          <Text style={styles.footerEndText}>You're all caught up</Text>
          <View style={styles.footerLine} />
        </View>
      );
    }
    return <View style={styles.footerSpacer} />;
  };

  const renderSkeletons = () => (
    <View style={{ paddingHorizontal: 16 }}>
      {renderHeader()}
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );

  if (loading && isFirstLoad.current) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <PageHeader title="Subscription" />
        {renderSkeletons()}
      </SafeAreaView>
    );
  }

  const theme = {
    bg: isDark ? "#060B1A" : "#F3F4F6",
    card: isDark ? "#1E293B" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666",
    border: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle="light-content" />
      <PageHeader title="Subscription" />

      <FlatList
        data={filteredData}
        keyExtractor={(item: any) => item._id?.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? <EmptyState /> : null}
        ListFooterComponent={renderFooter}
        contentContainerStyle={
          filteredData.length === 0
            ? styles.listContentEmpty
            : styles.listContent
        }
        renderItem={({ item }) => <SubscriptionCard item={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
            progressBackgroundColor="#0f172a"
          />
        }
        removeClippedSubviews
        windowSize={10}
        initialNumToRender={PAGE_SIZE}
        maxToRenderPerBatch={PAGE_SIZE}
        updateCellsBatchingPeriod={50}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },

  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  listContentEmpty: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  // Skeleton
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1e293b",
  },
  skeletonLines: { flex: 1, marginLeft: 14 },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1e293b",
  },
  skeletonBadge: {
    width: 60,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    marginLeft: 10,
  },

  // Footer
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  footerText: { color: "#64748b", fontSize: 13 },
  footerEnd: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    paddingVertical: 24,
    gap: 10,
  },
  footerLine: { flex: 1, height: 1, backgroundColor: "#1e293b" },
  footerEndText: { color: "#475569", fontSize: 12, fontWeight: "500" },
  footerSpacer: { height: 24 },

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    color: "#e2e8f0",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
