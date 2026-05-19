import NoData from "@/components/common/no-data/No-data";
import PageHeader from "@/components/common/PageHeader";
import TopBackground from "@/components/common/TopBackground";
import NotificationCard from "@/components/organisms/NotificationCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getNotificationList } from "@/redux/slice/notificationSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Notification() {
  const PAGE_SIZE = 12;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useAppTheme();

  const { notification, loading, totalCount } = useSelector(
    (state: RootState) => state.notification,
  );

  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const isFirstLoad = useRef<boolean>(true);

  useEffect(() => {
    dispatch(getNotificationList({ page, limit: PAGE_SIZE })).finally(() => {
      setLoadingMore(false);
      setRefreshing(false);
      isFirstLoad.current = false;
    });
  }, [page, dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    if (page === 1) {
      dispatch(getNotificationList({ page: 1, limit: PAGE_SIZE })).finally(() =>
        setRefreshing(false),
      );
    } else {
      setPage(1);
    }
  }, [page, dispatch]);

  const onEndReached = useCallback(() => {
    const hasMore = notification?.length < (totalCount ?? 0);

    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    setPage((prev) => prev + 1);
  }, [loadingMore, notification?.length, totalCount, loading]);

  const renderFooter = () => {
    const hasMore = notification?.length < (totalCount ?? 0);

    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text style={styles.footerText}>Loading more…</Text>
        </View>
      );
    }

    if (!hasMore && notification?.length > 0) {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <TopBackground />

      <View style={styles.inner}>
        <PageHeader
          title=""
          rightIcon="settings"
          onRightPress={() => router.push("/settings-screen")}
        />
        <FlatList
          data={notification}
          keyExtractor={(item: any) => item._id?.toString()}
          ListEmptyComponent={
            !loading && !isFirstLoad.current ? (
              <NoData
                title="No notifications found."
                subTitle="We couldn't find any records."
              />
            ) : null
          }
          ListFooterComponent={renderFooter}
          contentContainerStyle={
            notification?.length === 0
              ? styles.listContentEmpty
              : styles.listContent
          }
          renderItem={({ item }) => <NotificationCard item={item} />}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  listContentEmpty: {
    paddingHorizontal: 16,
    flexGrow: 1,
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
});
