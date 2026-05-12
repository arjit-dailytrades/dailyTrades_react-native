import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import NoData from "@/components/common/no-data/No-data";
import { Tabs } from "@/components/common/Tabs";
import TopBackground from "@/components/common/TopBackground";
import Disclosure from "@/components/expert/Disclosure";
import ExpertPastPerformanceCard from "@/components/expert/ExpertPastPerformanceCard";
import ExpertPerformanceDetails from "@/components/expert/ExpertPerformanceDetails";
import InvestorCharter from "@/components/expert/InvestorCharter";
import PastPerformanceFilter from "@/components/expert/PastPerformanceFilter";
import RegulatoryDisclosures from "@/components/expert/RegulatoryDisclosure";
import UserAgreement from "@/components/expert/UserAgreement";
import {
  filterOptions,
  PAST_PERFORMANCE_TAB,
  priceOption,
  segmentOptions,
  TAB_OPTIONS,
  typeOptions,
} from "@/constants/data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { fetchExpertPerformance } from "@/redux/slice/expertSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { StatusBar } from "expo-status-bar";

export default function ExpertPerformance() {
  const { advisorId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useAppTheme();

  const [activeTab, setActiveTab] = useState(PAST_PERFORMANCE_TAB);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("");
  const [type, setType] = useState("");
  const [freePaid, setFreePaid] = useState("");
  const [selected, setSelected] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { expertPastPerformance, isLoadingPast } = useSelector(
    (state: RootState) => state.expert,
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setSegment("");
    setType("");
    setFreePaid("");
    setSelected("");
    setDebouncedSearch("");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (activeTab !== PAST_PERFORMANCE_TAB) return;

    dispatch(
      fetchExpertPerformance({
        advisorId,
        page,
        segment,
        type,
        selected,
        debouncedSearch,
        freePaid,
      }),
    );
  }, [
    dispatch,
    activeTab,
    page,
    segment,
    type,
    selected,
    debouncedSearch,
    freePaid,
    advisorId,
  ]);

  const handleSegmentChange = (val: string) => {
    setPage(1);
    setSegment(val);
  };

  const handleTypeChange = (val: string) => {
    setPage(1);
    setType(val);
  };

  const handleFreePaidChange = (val: string) => {
    setPage(1);
    setFreePaid(val);
  };

  const handleSelectedChange = (val: string) => {
    setPage(1);
    setSelected(val);
  };

  const handleLoadMore = () => {
    if (!isLoadingPast && expertPastPerformance?.pages > page) {
      setPage((prev) => prev + 1);
    }
  };

  const renderFooter = () => {
    if (isLoadingPast && page > 1) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#0068FF" />
        </View>
      );
    }
    return <View style={{ height: 40 }} />;
  };

  const listData = useMemo(() => {
    const base = [
      { id: "header-details", type: "DETAILS" },
      { id: "header-filters", type: "FILTERS" },
    ];

    if (activeTab !== PAST_PERFORMANCE_TAB) {
      return [...base, { id: "tab-content", type: "TAB_CONTENT" }];
    }

    if (isLoadingPast && page === 1) {
      return [...base, { id: "loading-indicator", type: "INITIAL_LOADER" }];
    }

    if (
      !expertPastPerformance?.records ||
      expertPastPerformance.records.length === 0
    ) {
      return [...base, { id: "no-data-item", type: "EMPTY_STATE" }];
    }

    return [...base, ...(expertPastPerformance?.records || [])];
  }, [isLoadingPast, expertPastPerformance, page, activeTab]);

  const renderContent = ({ item }: any) => {
    switch (item.type) {
      case "DETAILS":
        return <ExpertPerformanceDetails />;

      case "FILTERS":
        return (
          <View
            style={[styles.stickyWrapper, { backgroundColor: theme.blurBg }]}
          >
            <Tabs
              options={TAB_OPTIONS}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
            {activeTab === PAST_PERFORMANCE_TAB && (
              <>
                <PastPerformanceFilter
                  segment={segment}
                  setSegment={handleSegmentChange}
                  type={type}
                  setType={handleTypeChange}
                  freePaid={freePaid}
                  setFreePaid={handleFreePaidChange}
                  search={search}
                  setSearch={setSearch}
                  selected={selected}
                  setSelected={handleSelectedChange}
                  segmentOptions={segmentOptions}
                  typeOptions={typeOptions}
                  priceOption={priceOption}
                  filterOptions={filterOptions}
                />
                <View
                  style={[styles.line, { backgroundColor: theme.glassBorder }]}
                />
              </>
            )}
          </View>
        );

      case "INITIAL_LOADER":
        return (
          <View style={styles.cardLoader}>
            <ActivityIndicator size="large" color="#0068FF" />
          </View>
        );

      case "EMPTY_STATE":
        return (
          <View style={styles.emptyContainer}>
            <NoData
              title="No Performance Data"
              subTitle="We couldn't find any records for the selected filters."
            />
          </View>
        );

      case "TAB_CONTENT":
        switch (activeTab) {
          case "Regulatory Disclosures":
            return <RegulatoryDisclosures />;
          case "Investor Charter":
            return <InvestorCharter />;
          case "User Agreement":
            return <UserAgreement />;
          case "Disclosure":
            return <Disclosure />;
          default:
            return null;
        }

      default:
        return (
          <View style={{ paddingHorizontal: 5 }}>
            <ExpertPastPerformanceCard item={item} />
          </View>
        );
    }
  };

  const isDark = useColorScheme() === "dark";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBackground />
      <FlatList
        data={listData}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={renderContent}
        stickyHeaderIndices={[1]}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: {
    paddingBottom: 20,
  },
  stickyWrapper: {
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  line: {
    height: 1,
    width: "100%",
    marginTop: 5,
  },
  cardLoader: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  footerLoader: {
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 400,
    justifyContent: "center",
    alignItems: "center",
  },
});
