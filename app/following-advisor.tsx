import NoData from "@/components/common/no-data/No-data";
import PageHeader from "@/components/common/PageHeader";
import AdvisorCard from "@/components/expert/AdvisorCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import { fetchFollowingAdvisor } from "@/redux/slice/expertSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Image } from "expo-image";
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

const FollowingAdvisorScreen: React.FC = () => {
  const theme = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { followingAdvisor, isFollowLoading } = useSelector(
    (state: RootState) => state.expert,
  );

  useEffect(() => {
    dispatch(fetchFollowingAdvisor());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchFollowingAdvisor());
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  // Initial full-screen loading state
  if (isFollowLoading && !followingAdvisor?.length && !isRefreshing) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor="#0d1829" />
        <PageHeader title="Following Experts" />

        {/* Background */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image
            source={require("../assets/images/topBG.png")}
            style={styles.bgImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color={theme.primary ?? "#4f8ef7"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1829" />
      <PageHeader title="Following Experts" />

      {/* Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={require("../assets/images/topBG.png")}
          style={styles.bgImage}
          contentFit="cover"
        />
      </View>

      <FlatList
        data={followingAdvisor}
        keyExtractor={(item) => item?.advisorId?.toString()}
        renderItem={({ item }) => <AdvisorCard item={item} />}
        contentContainerStyle={[
          styles.scrollContent,
          !followingAdvisor?.length && styles.emptyContainer,
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
            <NoData title="No followed advisor yet" />
          </View>
        }
        ListFooterComponent={
          isFollowLoading && (followingAdvisor?.length ?? 0) > 0 ? (
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
  bgImage: {
    ...StyleSheet.absoluteFillObject,
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

export default FollowingAdvisorScreen;
