// import NoData from "@/components/common/no-data/No-data";
// import ExpertPastPerformanceCard from "@/components/expert/ExpertPastPerformanceCard";
// import ExpertPerformanceDetails from "@/components/expert/ExpertPerformanceDetails";
// import PastPerformanceFilter from "@/components/expert/PastPerformanceFilter";
// import { fetchExpertPerformance } from "@/redux/slice/expertSlice";
// import { AppDispatch, RootState } from "@/redux/store";
// import { useLocalSearchParams } from "expo-router";
// import { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useDispatch, useSelector } from "react-redux";

// export default function ExpertPerformance() {
//   const { advisorId } = useLocalSearchParams();
//   const dispatch = useDispatch<AppDispatch>();
//   const colorScheme = useColorScheme();
//   const insets = useSafeAreaInsets();
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [activeFilter, setActiveFilter] = useState("Monthly");
//   const [segment, setSegment] = useState("");
//   const [type, setType] = useState("");
//   const [freePaid, setFreePaid] = useState("");
//   const [selected, setSelected] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(search);
//   const { expertPastPerformance, isLoadingPast } = useSelector(
//     (state: RootState) => state.expert,
//   );
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [search]);
//   useEffect(() => {
//     dispatch(
//       fetchExpertPerformance({
//         advisorId,
//         page,
//         segment,
//         type,
//         selected,
//         debouncedSearch,
//         freePaid,
//       }),
//     );
//   }, [page, segment, type, selected, debouncedSearch, freePaid]);

//   const isDark = colorScheme === "dark";
//   const theme = {
//     bg: isDark ? "#060B1A" : "#F3F4F6",
//     card: isDark ? "#161B2C" : "#FFFFFF",
//     text: isDark ? "#FFFFFF" : "#1A2138",
//     subText: isDark ? "#9CA3AF" : "#666",
//     inputBg: isDark ? "#1F2937" : "#FFF",
//     accent: "#3B82F6",
//     border: isDark ? "#374151" : "#E5E7EB",
//     glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
//   };
//   const handleLoadMore = () => {
//     if (!isLoadingPast && expertPastPerformance?.pages > page) {
//       setPage((prev) => prev + 1);
//     }
//   };
//   const renderFooter = () => {
//     if (isLoadingPast && page > 1) {
//       return (
//         <View style={styles.footerLoader}>
//           <ActivityIndicator size="small" color="#0068FF" />
//         </View>
//       );
//     }
//     return null;
//   };

//   const segmentOptions = [
//     {
//       label: "Equity",
//       value: "EQ",
//     },
//     {
//       label: "Future",
//       value: "FU",
//     },
//     {
//       label: "Option",
//       value: "OPT",
//     },
//   ];

//   const typeOptions = [
//     {
//       label: "BTST",
//       value: "BTST",
//     },
//     {
//       label: "Intraday",
//       value: "INTRADAY",
//     },
//     {
//       label: "Positional",
//       value: "POSITIONAL",
//     },
//     {
//       label: "STBT",
//       value: "STBT",
//     },
//     {
//       label: "LONGTERM",
//       value: "LONGTERM",
//     },
//   ];
//   const priceOption = [
//     {
//       label: "Free",
//       value: "FREE",
//     },
//     {
//       label: "Paid",
//       value: "PAID",
//     },
//   ];
//   const filterOptions = [
//     {
//       label: "All",
//       value: "",
//     },
//     {
//       label: "Current Month",
//       value: "current_month",
//     },
//     {
//       label: "Last Month",
//       value: "last_month",
//     },
//     {
//       label: "Quarterly",
//       value: "quarterly",
//     },
//     {
//       label: "Yearly",
//       value: "yearly",
//     },
//   ];

//   const listData = useMemo(() => {
//     const base = [
//       { id: "header-details", type: "DETAILS" },
//       { id: "header-filters", type: "FILTERS" },
//     ];

//     if (isLoadingPast && page === 1) {
//       return [...base, { id: "loading-indicator", type: "INITIAL_LOADER" }];
//     }

//     return [...base, ...(expertPastPerformance?.records || [])];
//   }, [isLoadingPast, expertPastPerformance, page]);

//   const renderContent = ({ item }: any) => {
//     if (item.type === "DETAILS") return <ExpertPerformanceDetails />;
//     if (item.type === "FILTERS")
//       return (
//         <View
//           style={[
//             styles.stickyWrapper,
//             { backgroundColor: theme.bg, paddingTop: insets.top },
//           ]}
//         >
//           <PastPerformanceFilter
//             typeOptions={typeOptions}
//             segmentOptions={segmentOptions}
//             segment={segment}
//             setSegment={setSegment}
//             type={type}
//             setType={setType}
//             priceOption={priceOption}
//             freePaid={freePaid}
//             setFreePaid={setFreePaid}
//             search={search}
//             setSearch={setSearch}
//             selected={selected}
//             setSelected={setSelected}
//             filterOptions={filterOptions}
//           />
//           <View style={[styles.line, { backgroundColor: theme.glassBorder }]} />
//         </View>
//       );

//     if (item.type === "INITIAL_LOADER") {
//       return (
//         <View style={styles.cardLoader}>
//           <ActivityIndicator size="large" color="#0068FF" />
//           <Text style={{ marginTop: 10, color: theme.subText }}>
//             Fetching results...
//           </Text>
//         </View>
//       );
//     }

//     return <ExpertPastPerformanceCard item={item} />;
//   };
//   return (
//     <View style={[styles.container, { backgroundColor: theme.bg }]}>
//       <FlatList
//         data={listData}
//         keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
//         renderItem={renderContent}
//         stickyHeaderIndices={[1]}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={renderFooter}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={() =>
//           !isLoadingPast ? (
//             <View style={styles.emptyContainer}>
//               <NoData />
//               <Text style={{ color: theme.subText }}>No records found.</Text>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   search: {
//     margin: 15,
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     height: 50,
//     fontSize: 15,
//     elevation: 3,
//   },
//   filterRow: { paddingHorizontal: 15, paddingBottom: 20 },
//   filterBtn: {
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 25,
//     marginRight: 10,
//     elevation: 2,
//   },
//   filterText: { fontWeight: "600", fontSize: 13 },
//   listContent: { paddingBottom: 30 },
//   loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   footerLoader: { paddingVertical: 20, alignItems: "center" },
//   emptyContainer: { flex: 1, alignItems: "center", marginTop: 50 },
//   line: {
//     height: 1,
//     width: "100%",
//     marginBottom: 5,
//   },
//   cardLoader: {
//     paddingVertical: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: 200,
//   },
//   stickyWrapper: {
//     zIndex: 10,
//     elevation: 3,
//   },
// });

import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useColorScheme,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

// Custom Components
import NoData from "@/components/common/no-data/No-data";
import ExpertPastPerformanceCard from "@/components/expert/ExpertPastPerformanceCard";
import ExpertPerformanceDetails from "@/components/expert/ExpertPerformanceDetails";
import PastPerformanceFilter from "@/components/expert/PastPerformanceFilter";

// Redux
import { fetchExpertPerformance } from "@/redux/slice/expertSlice";
import { AppDispatch, RootState } from "@/redux/store";

export default function ExpertPerformance() {
  const { advisorId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Filters & Pagination States
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

  const isDark = colorScheme === "dark";

  // Theme Object
  const theme = {
    bg: isDark ? "#060B1A" : "#F3F4F6",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666",
    glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
  };

  // Search Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Data Fetching Logic (Triggers on filter or page change)
  useEffect(() => {
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
  }, [page, segment, type, selected, debouncedSearch, freePaid, advisorId]);

  // Pagination Handler
  const handleLoadMore = () => {
    if (!isLoadingPast && expertPastPerformance?.pages > page) {
      setPage((prev) => prev + 1);
    }
  };

  // Footer Loader (For Infinite Scroll)
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

  // Data Formatting for FlatList (Merging Header + Content)
  const listData = useMemo(() => {
    const base = [
      { id: "header-details", type: "DETAILS" },
      { id: "header-filters", type: "FILTERS" },
    ];

    // Case 1: Initial Loading (Show loader below filters)
    if (isLoadingPast && page === 1) {
      return [...base, { id: "loading-indicator", type: "INITIAL_LOADER" }];
    }

    // Case 2: No Data Found (Show NoData component below filters)
    if (
      !expertPastPerformance?.records ||
      expertPastPerformance.records.length === 0
    ) {
      return [...base, { id: "no-data-item", type: "EMPTY_STATE" }];
    }

    // Case 3: Data Available
    return [...base, ...(expertPastPerformance?.records || [])];
  }, [isLoadingPast, expertPastPerformance, page]);

  // Unified Render Item function
  const renderContent = ({ item }: any) => {
    switch (item.type) {
      case "DETAILS":
        return <ExpertPerformanceDetails />;

      case "FILTERS":
        return (
          <View
            style={[
              styles.stickyWrapper,
              {
                backgroundColor: theme.bg,
                paddingTop: insets.top > 0 ? insets.top : 10,
              },
            ]}
          >
            <PastPerformanceFilter
              segment={segment}
              setSegment={setSegment}
              type={type}
              setType={setType}
              freePaid={freePaid}
              setFreePaid={setFreePaid}
              search={search}
              setSearch={setSearch}
              selected={selected}
              setSelected={setSelected}
              // Options are defined below
              segmentOptions={segmentOptions}
              typeOptions={typeOptions}
              priceOption={priceOption}
              filterOptions={filterOptions}
            />
            <View
              style={[styles.line, { backgroundColor: theme.glassBorder }]}
            />
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
              msg="We couldn't find any records for the selected filters."
            />
          </View>
        );

      default:
        return <ExpertPastPerformanceCard item={item} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
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
      />
    </View>
  );
}

// --- CONFIG DATA ---
const segmentOptions = [
  { label: "Equity", value: "EQ" },
  { label: "Future", value: "FU" },
  { label: "Option", value: "OPT" },
];

const typeOptions = [
  { label: "BTST", value: "BTST" },
  { label: "Intraday", value: "INTRADAY" },
  { label: "Positional", value: "POSITIONAL" },
  { label: "STBT", value: "STBT" },
  { label: "LONGTERM", value: "LONGTERM" },
];

const priceOption = [
  { label: "Free", value: "FREE" },
  { label: "Paid", value: "PAID" },
];

const filterOptions = [
  { label: "All", value: "" },
  { label: "Current Month", value: "current_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1 },
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
