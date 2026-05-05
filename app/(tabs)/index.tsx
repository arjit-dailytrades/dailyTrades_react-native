import AppHeader from "@/components/AppHeader";
import ConnectBrokerCard from "@/components/broker/ConnectBroker";
import TradeCard from "@/components/trade/TradeCard";
import TradeFilters from "@/components/trade/TradeFilter";
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
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

//  Stable ListHeader (never causes scroll glitch)
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

//  Stable ListFooter
const ListFooter = ({
  loading,
  hasMore,
  isDark,
}: {
  loading: boolean;
  hasMore: boolean;
  isDark: boolean;
}) => {
  if (loading) {
    return (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <ActivityIndicator color={isDark ? "#fff" : "#010D26"} />
      </View>
    );
  }
  if (!hasMore) {
    return (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <Text
          style={{ color: isDark ? "#ffffff60" : "#00000060", fontSize: 12 }}
        >
          No more trades
        </Text>
      </View>
    );
  }
  return null;
};

// Stable empty state
const ListEmpty = ({
  loading,
  isDark,
}: {
  loading: boolean;
  isDark: boolean;
}) => {
  if (loading) return null;
  return (
    <View style={{ paddingVertical: 60, alignItems: "center" }}>
      <Text style={{ color: isDark ? "#ffffff60" : "#00000060", fontSize: 14 }}>
        No trades available
      </Text>
    </View>
  );
};

export default function HomeScreen() {
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

  const resetFilters = useCallback(
    (newSegment: string, newType: string, newFreePaid: string) => {
      setPage(1);
      setSegment(newSegment);
      setType(newType);
      setFreePaid(newFreePaid);
    },
    [],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    try {
      await Promise.all([
        dispatch(fetchScripts({ page: 1, type, segment, freePaid, advisorId })),
        dispatch(fetchScriptStats({ type, segment, freePaid, advisorId })),
      ]);
    } finally {
      // Always stop spinner even if requests fail
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
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#010D26" : "#ffffff" },
      ]}
    >
      <AppHeader title="Trades" />

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
          <ListFooter
            loading={loading && page > 1}
            hasMore={hasMore}
            isDark={isDark}
          />
        }
        ListEmptyComponent={<ListEmpty loading={loading} isDark={isDark} />}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingBottom: 50,
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#5a2ca0",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  headerIcons: {
    flexDirection: "row",
  },

  filters: {
    marginTop: Platform.select({
      ios: 10,
      android: 5,
    }),
    padding: 5,
  },

  sectionTitle: {
    marginLeft: 15,
    marginTop: 10,
    fontWeight: "600",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  closeBtn: {
    marginTop: 20,
    backgroundColor: "#6C3EF4",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },
});
