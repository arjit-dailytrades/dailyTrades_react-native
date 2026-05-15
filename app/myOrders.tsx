import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NoData from "@/components/common/no-data/No-data";
import PageHeader from "@/components/common/PageHeader";
import { OrderCard } from "@/components/organisms/order-card";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getOrderList } from "@/redux/slice/orderSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState<string>("Orders");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const theme = useAppTheme();

  const { orders, loading, totalCount } = useSelector(
    (state: RootState) => state.order,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);

  const fetchOrders = async (pageNum: number, isLoadMore = false) => {
    if (!isLoadMore) setPage(1);
    await dispatch(getOrderList({ page: pageNum }) as any);
    setRefreshing(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(1);
  };

  const onEndReached = () => {
    const hasMore = orders.length < (totalCount || 0);
    if (loadingMore || loading || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchOrders(nextPage, true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle="light-content" />
      {/* <TopBackground /> */}
      <PageHeader title="My Orders" showBack={true} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" /> : null
        }
        ListEmptyComponent={<NoData title="No orders found!" />}
      />
    </SafeAreaView>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
});
