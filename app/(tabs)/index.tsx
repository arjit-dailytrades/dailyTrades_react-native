import ConnectBrokerCard from "@/components/broker/ConnectBrokerCard";
import { CommonHeader } from "@/components/common/CommonHeader";
import TopBackground from "@/components/common/TopBackground";
import TradeCard from "@/components/organisms/TradeCard";
import TradeFilters from "@/components/trade/TradeFilter";
import { useAppTheme } from "@/hooks/use-app-theme";
import { fetchExpertDetail } from "@/redux/slice/expertSlice";
import {
  fetchCanOpenScript,
  fetchScripts,
  fetchScriptStats,
} from "@/redux/slice/scriptSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { requestLTP } from "@/services/ltpService";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const ListHeader = ({
  typeOptions,
  segmentOptions,
  segment,
  setSegment,
  type,
  setType,
  freePaid,
  setFreePaid,
}: any) => (
  <View>
    <ConnectBrokerCard />
    <View
      style={{
        marginTop: Platform.select({ ios: 10, android: 5 }),
        padding: 5,
      }}
    >
      <TradeFilters
        typeOptions={typeOptions}
        segmentOptions={segmentOptions}
        segment={segment}
        setSegment={setSegment}
        type={type}
        setType={setType}
        freePaid={freePaid}
        setFreePaid={setFreePaid}
      />
    </View>
  </View>
);

export default function HomeScreen() {
  const theme = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {
    scripts,
    loading,
    canOpenScript,
    canOpenLoading,
    statsCount,
    statsLoading,
    totalPages,
  } = useSelector((state: RootState) => state.script);
  console.log(totalPages);

  const { expertDetail, advisorId } = useSelector(
    (state: RootState) => state.expert,
  );

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const { subscriptionId } = useLocalSearchParams();
  const id = Array.isArray(subscriptionId) ? subscriptionId[0] : subscriptionId;

  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [advisor, setAdvisor] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  const [segment, setSegment] = useState("");
  const [type, setType] = useState("");
  const [freePaid, setFreePaid] = useState("");

  const hasMore = totalPages
    ? page < totalPages
    : scripts?.length > 0 && scripts.length % 10 === 0;

  const isFetchingRef = useRef(false);

  const segmentOptions = [
    {
      label: "Equity",
      value: "EQ",
      count: statsCount?.scripts?.segmentCounts?.equityScriptCount,
    },
    {
      label: "Future",
      value: "FU",
      count: statsCount?.scripts?.segmentCounts?.futureScriptCount,
    },
    {
      label: "Option",
      value: "OPT",
      count: statsCount?.scripts?.segmentCounts?.optionalScriptCount,
    },
  ];

  const typeOptions = [
    {
      label: "BTST",
      value: "BTST",
      count: statsCount?.scripts?.sTypeCounts?.btstScriptCount,
    },
    {
      label: "Intraday",
      value: "INTRADAY",
      count: statsCount?.scripts?.sTypeCounts?.intraDayScriptCount,
    },
    {
      label: "Positional",
      value: "POSITIONAL",
      count: statsCount?.scripts?.sTypeCounts?.positionalScriptCount,
    },
    {
      label: "STBT",
      value: "STBT",
      count: statsCount?.scripts?.sTypeCounts?.stbtScriptCount,
    },
    {
      label: "LONGTERM",
      value: "LONGTERM",
      count: statsCount?.scripts?.sTypeCounts?.longTermScriptCount,
    },
  ];

  useEffect(() => {
    isFetchingRef.current = true;
    dispatch(
      fetchScripts({ page, type, segment, freePaid, advisorId }),
    ).finally(() => {
      isFetchingRef.current = false;
    });
  }, [page, type, segment, freePaid, advisorId]);

  useEffect(() => {
    dispatch(fetchScriptStats({ type, segment, freePaid, advisorId }));
  }, [freePaid, type, segment, advisorId]);

  useEffect(() => {
    if (id) dispatch(fetchExpertDetail({ subscriptionId: id }));
  }, [id]);

  useEffect(() => {
    if (!scripts?.length) return;
    const tokens = scripts
      .filter((s: any) => s?.instrumentToken)
      .map((s: any) => s.instrumentToken);
    if (tokens.length) requestLTP(tokens);
  }, [scripts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    try {
      await Promise.all([
        dispatch(fetchScripts({ page: 1, type, segment, freePaid, advisorId })),
        dispatch(fetchScriptStats({ type, segment, freePaid, advisorId })),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [type, segment, freePaid, advisorId]);

  const onEndReached = useCallback(() => {
    if (isFetchingRef.current || loading || !hasMore) return;
    setPage((prev) => prev + 1);
  }, [loading, hasMore]);

  const openUnlockModal = useCallback((trade: any) => {
    setSelectedTrade(trade);
    setModalVisible(true);
    setAdvisor(trade.advisor);
    dispatch(fetchCanOpenScript({ scriptId: trade.id }));
  }, []);

  const closeUnlockModal = useCallback(() => {
    setModalVisible(false);
    setSelectedPlan(null);
    setSelectedTrade(null);
    setAdvisor({});
  }, []);

  const handleSelectPlan = useCallback((planId: string | null) => {
    setSelectedPlan(planId);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TradeCard item={item} onUnlock={openUnlockModal} />
    ),
    [openUnlockModal],
  );

  const keyExtractor = useCallback(
    (item: any) => (item?.id ?? Math.random()).toString(),
    [],
  );

  const listHeader = (
    <ListHeader
      typeOptions={typeOptions}
      segmentOptions={segmentOptions}
      segment={segment}
      setSegment={(v: string) => {
        setSegment(v);
        setPage(1);
      }}
      type={type}
      setType={(v: string) => {
        setType(v);
        setPage(1);
      }}
      freePaid={freePaid}
      setFreePaid={(v: string) => {
        setFreePaid(v);
        setPage(1);
      }}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      <TopBackground />
      <CommonHeader
        profileImageUri="https://picsum.photos/200/300"
        onPremiumPress={() => console.log("Premium Clicked")}
      />

      <FlatList
        data={scripts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={listHeader}
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator
              style={{ paddingVertical: 20 }}
              color={isDark ? "#fff" : "#010D26"}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#ffffff60" : "#00000060" },
              ]}
            >
              No trades available
            </Text>
          ) : null
        }
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={8}
        initialNumToRender={6}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={styles.listContent}
      />

      {/* <UnlockTradeModal
        visible={modalVisible}
        trade={selectedTrade}
        advisor={advisor}
        onClose={closeUnlockModal}
        handleSelectPlan={handleSelectPlan}
        selectedPlan={selectedPlan}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 14,
  },
});
