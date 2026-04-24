import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CommonHeader } from "@/components/common/CommonHeader";
import { OrderCard } from "@/components/my-orders/order-card";
import { Tabs } from "@/components/my-orders/order-tabs";
import { getOrderList } from "@/redux/slice/orderSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

type OrderStatus = "Success" | "Failed";

interface Order {
  id: string;
  stockName: string;
  exchange: string;
  status: OrderStatus;
  side: string;
  entry: string;
  stopLoss: string;
  target: string;
  date: string;
  time: string;
}

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState<string>("Orders");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = {
    bg: isDark ? "#060B1A" : "#F3F4F6",
    card: isDark ? "#1E293B" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666",
    border: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
    primary: "#6366F1",
    success: "#22C55E",
    warning: "#F59E0B",
  };
  const ordersData: Order[] = [
    {
      id: "1",
      stockName: "MARKSANS",
      exchange: "NSE",
      status: "Failed",
      side: "BUY",
      entry: "Market",
      stopLoss: "680",
      target: "810",
      date: "20 Mar 2026",
      time: "04:03 PM",
    },
    {
      id: "2",
      stockName: "GROWW",
      exchange: "NSE",
      status: "Success",
      side: "BUY",
      entry: "Market",
      stopLoss: "159",
      target: "210",
      date: "02 Mar 2026",
      time: "10:21 PM",
    },
  ];
  const { orders, loading } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    dispatch(getOrderList({ page }));
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle="light-content" />
      <CommonHeader
        profileImageUri="https://picsum.photos/200/300"
        onPremiumPress={() => console.log("Premium Clicked")}
      />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ordersData.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
});
