import AppHeader from "@/components/AppHeader";
import ViewPlanModal from "@/components/common/ViewPlanModal";
import ExpertCard from "@/components/expert/ExpertCard";
import ExpertFilter from "@/components/expert/ExpertFilter";
import { fetchExpert, fetchSubscriptionPlans } from "@/redux/slice/expertSlice";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ExpertScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<any>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showPlan, setShowPlan] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [type, setType] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [follow, setFollow] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { experts, isExpertLoading } = useSelector(
    (state: RootState) => state.expert,
  );

  const handleSetFollow = () => {
    setFollow(!follow);
  };
  const handleSetFavorite = () => {
    setFavorite(!favorite);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
    dispatch(fetchExpert({ page: 1, debouncedSearch, type, follow, favorite }));
  }, [debouncedSearch, type, follow, favorite]);

  // 2. Load More Pages
  useEffect(() => {
    if (page > 1) {
      dispatch(
        fetchExpert({
          page,
          debouncedSearch,
          type,
          follow,
          favorite,
        }),
      );
    }
  }, [page]);

  const isDark = colorScheme === "dark";

  const theme = {
    bg: isDark ? "#010D26" : "#ffffff",
    card: isDark ? "#161B2C" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666",
    inputBg: isDark ? "#1F2937" : "#FFF",
    accent: "#3B82F6",
    border: isDark ? "#374151" : "#E5E7EB",
    glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
  };

  const handleViewPlans = (item: any) => {
    setShowPlan(true);
    setSelectedKey(item?.subscriptionPlan?.plan);
    dispatch(fetchSubscriptionPlans({ advisorId: item?.id }));
  };

  const handleLoadMore = () => {
    const hasMore = experts?.records?.length < (experts?.total || 0);

    if (!isExpertLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const renderFooter = () => {
    if (isExpertLoading && page > 1) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#0068FF" />
        </View>
      );
    }
    return null;
  };

  const advisorTypeOptions = [
    { label: "SEBI Registered Advisor", value: "SEBI_REGISTERED_ADVISOR" },
    { label: "SEBI Research Analyst", value: "SEBI_RESEARCH_ANALYST" },
  ];

  const onRefresh = async () => {
    setRefreshing(true);

    setPage(1);

    await dispatch(
      fetchExpert({
        page: 1,
        debouncedSearch,
        type,
        follow,
        favorite,
      }),
    );

    setRefreshing(false);
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <AppHeader title="Experts" />

      <ExpertFilter
        advisorTypeOption={advisorTypeOptions}
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        handleSetFollow={handleSetFollow}
        handleSetFavorite={handleSetFavorite}
        follow={follow}
        favorite={favorite}
      />
      <View style={[styles.line, { backgroundColor: theme.glassBorder }]} />
      {isExpertLoading && page === 1 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0068FF" />
        </View>
      ) : (
        <FlatList
          data={experts?.records || []}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <ExpertCard item={item} handleViewPlans={handleViewPlans} />
          )}
          // ListHeaderComponent={}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={80}
          // Empty state handling
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={{ color: theme.subText }}>No experts found.</Text>
            </View>
          )}
        />
      )}

      <ViewPlanModal
        visible={showPlan}
        onClose={() => setShowPlan(false)}
        selectedKey={selectedKey}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    margin: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    elevation: 3,
  },
  filterRow: { paddingHorizontal: 15, paddingBottom: 20 },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    elevation: 2,
  },
  filterText: { fontWeight: "600", fontSize: 13 },
  listContent: { paddingBottom: 30 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 50 },
  line: {
    height: 1,
    width: "100%",
    marginBottom: 5,
  },
});
