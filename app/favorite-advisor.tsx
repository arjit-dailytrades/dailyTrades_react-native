import NoData from "@/components/common/no-data/No-data";
import PageHeader from "@/components/common/PageHeader";
import TopBackground from "@/components/common/TopBackground";
import AdvisorCard from "@/components/expert/AdvisorCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import { fetchFavoriteAdvisor } from "@/redux/slice/expertSlice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const FavoriteAdvisorScreen: React.FC = () => {
  const theme = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { favoriteAdvisor, isFavoriteLoading } = useSelector(
    (state: RootState) => state.expert,
  );

  useEffect(() => {
    dispatch(fetchFavoriteAdvisor());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchFavoriteAdvisor());
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  // Initial full-screen loading state
  if (isFavoriteLoading && !favoriteAdvisor?.length && !isRefreshing) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#0d1829" />
        <PageHeader title="Favorite Experts" />
        <TopBackground />
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color={theme.primary ?? "#4f8ef7"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1829" />
      <PageHeader title="Favorite Experts" />
      <TopBackground />
      <FlatList
        data={favoriteAdvisor}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => <AdvisorCard item={item} />}
        contentContainerStyle={[
          styles.scrollContent,
          !favoriteAdvisor?.length && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary ?? "#4f8ef7"}
            colors={[theme.primary ?? "#4f8ef7"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.centeredView}>
            <NoData title="No favorite advisor yet" />
          </View>
        }
        ListFooterComponent={
          isFavoriteLoading && (favoriteAdvisor?.length ?? 0) > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator
                size="small"
                color={theme.primary ?? "#4f8ef7"}
              />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});

export default FavoriteAdvisorScreen;
