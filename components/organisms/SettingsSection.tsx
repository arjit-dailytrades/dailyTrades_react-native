import { apiRequest } from "@/apiInstance";
import { Strategy } from "@/components/organisms/StrategyNotificationCard";
import { DEFAULT_STRATEGY_LIST } from "@/constants/data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getProfile } from "@/redux/slice/profileSlice";
import { AppDispatch } from "@/redux/store";
import { showError, showSuccess } from "@/utils/toast";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import NotificationSettingSection from "../molecules/NotificationSettingSection";
import StrategySection from "../molecules/StrategySection";
import ToolSettingSection from "../molecules/ToolSettingSection";
import TradeAlertSection from "../molecules/TradeAlertSection";

export interface GeneralSettings {
  muted: boolean;
  partialExit: boolean;
  advisorMsg: boolean;
  newsletter: boolean;
}

export default function SettingsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useAppTheme();

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    muted: false,
    partialExit: false,
    advisorMsg: false,
    newsletter: false,
  });

  const [allTradeAlert, setAllTradeAlert] = useState(false);
  const [customTradeAlert, setCustomTradeAlert] = useState(false);
  const [strategyList, setStrategyList] = useState<Strategy[]>(
    DEFAULT_STRATEGY_LIST,
  );
  const [selectedStrategyIndexes, setSelectedStrategyIndexes] = useState<
    Set<number>
  >(new Set());

  const [isEnable, setIsEnable] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [allTradeAlertLoading, setAllTradeAlertLoading] = useState(false);
  const [customTradeAlertLoading, setCustomTradeAlertLoading] = useState(false);
  const [toolLoading, setToolLoading] = useState(false);

  //  Hydration

  const hydrateSegments = useCallback((segments: any[]) => {
    if (!Array.isArray(segments) || segments.length === 0) return;

    const selectedIdxs = new Set<number>();
    const hydrated = DEFAULT_STRATEGY_LIST.map((defaultStrategy, idx) => {
      const serverSeg = segments.find(
        (s) => s.segment === defaultStrategy.segment,
      );
      if (!serverSeg) return defaultStrategy;
      if (serverSeg.enabled) selectedIdxs.add(idx);

      const updatedConfig = defaultStrategy.config.map((cfgItem: any) => {
        const serverCfg = serverSeg.config?.find(
          (c: any) => c.condition === cfgItem.condition,
        );
        if (!serverCfg) return cfgItem;
        return {
          ...cfgItem,
          dailyAlert: Math.min(3, serverCfg.dailyAlert ?? cfgItem.dailyAlert),
        };
      });

      return { ...defaultStrategy, config: updatedConfig };
    });

    setStrategyList(hydrated);
    setSelectedStrategyIndexes(selectedIdxs);
  }, []);

  //  API Calls

  const fetchSettings = useCallback(async () => {
    try {
      const data = await apiRequest("/notification-setting", {
        method: "GET",
        auth: true,
      });
      if (!data) return;

      setGeneralSettings({
        muted: !!data.muted,
        partialExit: !!data.partialExit,
        advisorMsg: !!data.advisorMsg,
        newsletter: !!data.newsletter,
      });

      const ta = data.tradeAlert;
      if (!ta) return;

      setAllTradeAlert(!!ta.allTradeAlert);
      setCustomTradeAlert(!!ta.customTradeAlert);
      hydrateSegments(ta.segments);
    } catch (err) {
      console.error("Failed to fetch notification settings:", err);
    } finally {
      setIsFetching(false);
    }
  }, [hydrateSegments]);

  const getDetails = useCallback(async () => {
    try {
      const data = await apiRequest("/quantity-management/details", {
        method: "GET",
        auth: true,
      });
      if (data) {
        setHasActiveSubscription(!!data?.hasActiveSubscription);
        setIsEnable(!!data?.subscription?.isEnabled);
      }
    } catch (err) {
      console.error("Error fetching tool details:", err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    getDetails();
    dispatch(getProfile());
  }, [fetchSettings, getDetails, dispatch]);

  //  Helpers

  const buildSegmentsPayload = (
    list: Strategy[],
    enabledIdxs: Set<number>,
    useSelected: boolean,
  ) =>
    list.map((item, idx) => ({
      segment: item.segment,
      enabled: useSelected ? enabledIdxs.has(idx) : false,
      config: item.config.map((cfg: any) => ({
        riskRewardValue: cfg.riskRewardValue,
        condition: cfg.condition,
        dailyAlert: cfg.dailyAlert,
      })),
    }));

  //  Handlers

  const handleToggleTool = async (value: boolean) => {
    const prev = isEnable;
    setIsEnable(value);
    setToolLoading(true);
    try {
      const data = await apiRequest("/quantity-management/active-inactive", {
        method: "PUT",
        auth: true,
        body: { enable: value },
      });
      showSuccess(data?.message || "Tool setting updated successfully.");
      getDetails();
    } catch (err: any) {
      setIsEnable(prev);
      showError(err?.message || "Failed to update tool setting.");
    } finally {
      setToolLoading(false);
    }
  };

  const handleGeneralToggle = async (
    field: keyof GeneralSettings,
    value: boolean,
  ) => {
    const prev = generalSettings[field];
    setGeneralSettings((s) => ({ ...s, [field]: value }));
    try {
      const data = await apiRequest("/notification-setting", {
        method: "PATCH",
        auth: true,
        body: { [field]: value },
      });
      showSuccess(data?.message || "Preferences saved successfully.");
      fetchSettings();
    } catch (err: any) {
      setGeneralSettings((s) => ({ ...s, [field]: prev }));
      showError(err?.message || "Failed to update setting.");
    }
  };

  const handleAllTradeAlertToggle = async (value: boolean) => {
    const prevAll = allTradeAlert;
    const prevCustom = customTradeAlert;
    setAllTradeAlert(value);
    if (value) setCustomTradeAlert(false);
    setAllTradeAlertLoading(true);
    try {
      const data = await apiRequest("/notification-setting", {
        method: "PATCH",
        auth: true,
        body: {
          tradeAlert: {
            allTradeAlert: value,
            customTradeAlert: false,
            segments: buildSegmentsPayload(
              strategyList,
              selectedStrategyIndexes,
              false,
            ),
          },
        },
      });
      showSuccess(data?.message || "Preferences saved successfully.");
      fetchSettings();
    } catch (err: any) {
      setAllTradeAlert(prevAll);
      setCustomTradeAlert(prevCustom);
      showError(err?.message || "Failed to update All Trade Alert.");
    } finally {
      setAllTradeAlertLoading(false);
    }
  };

  const handleCustomTradeAlertToggle = async (value: boolean) => {
    const prevAll = allTradeAlert;
    const prevCustom = customTradeAlert;
    setCustomTradeAlert(value);
    if (value) setAllTradeAlert(false);
    setCustomTradeAlertLoading(true);
    try {
      const data = await apiRequest("/notification-setting", {
        method: "PATCH",
        auth: true,
        body: {
          tradeAlert: {
            allTradeAlert: false,
            customTradeAlert: value,
            segments: buildSegmentsPayload(
              strategyList,
              selectedStrategyIndexes,
              value,
            ),
          },
        },
      });
      showSuccess(data?.message || "Preferences saved successfully.");
      fetchSettings();
    } catch (err: any) {
      setCustomTradeAlert(prevCustom);
      setAllTradeAlert(prevAll);
      showError(err?.message || "Failed to update Custom Trade Alert.");
    } finally {
      setCustomTradeAlertLoading(false);
    }
  };

  const toggleStrategy = useCallback((idx: number) => {
    setSelectedStrategyIndexes((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }, []);

  const updateDailyAlert = (
    stratIdx: number,
    cfgIdx: number,
    value: number,
  ) => {
    setStrategyList((prev) =>
      prev.map((s, si) =>
        si !== stratIdx
          ? s
          : {
              ...s,
              config: s.config.map((c: any, ci: any) =>
                ci !== cfgIdx ? c : { ...c, dailyAlert: Math.min(3, value) },
              ),
            },
      ),
    );
  };

  //  Validation

  const noStrategySelected =
    customTradeAlert && selectedStrategyIndexes.size === 0;

  const hasEmptyConfig =
    customTradeAlert &&
    selectedStrategyIndexes.size > 0 &&
    strategyList
      .filter((_, i) => selectedStrategyIndexes.has(i))
      .some((item) => item.config.every((cfg: any) => cfg.dailyAlert === 0));

  const isSaveDisabled = isLoading || hasEmptyConfig || noStrategySelected;

  const handleSave = async () => {
    if (noStrategySelected) {
      showError("Please select at least one strategy.");
      return;
    }
    if (hasEmptyConfig) {
      showError("Set at least 1 daily alert per selected strategy.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiRequest("/notification-setting", {
        method: "PATCH",
        auth: true,
        body: {
          tradeAlert: {
            allTradeAlert: false,
            customTradeAlert,
            segments: buildSegmentsPayload(
              strategyList,
              selectedStrategyIndexes,
              customTradeAlert,
            ),
          },
        },
      });
      showSuccess(data?.message || "Preferences saved successfully.");
      fetchSettings();
    } catch (err: any) {
      showError(err?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  //  Loading State

  if (isFetching) {
    return (
      <View style={[styles.container]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.subText }]}>
            Loading settings…
          </Text>
        </View>
      </View>
    );
  }

  //  Render

  return (
    <View style={[styles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasActiveSubscription && (
          <ToolSettingSection
            isEnable={isEnable}
            toolLoading={toolLoading}
            onToggleTool={handleToggleTool}
            theme={theme}
          />
        )}

        <NotificationSettingSection
          generalSettings={generalSettings}
          onToggle={handleGeneralToggle}
          theme={theme}
        />

        <TradeAlertSection
          allTradeAlert={allTradeAlert}
          customTradeAlert={customTradeAlert}
          allTradeAlertLoading={allTradeAlertLoading}
          customTradeAlertLoading={customTradeAlertLoading}
          onAllTradeAlertToggle={handleAllTradeAlertToggle}
          onCustomTradeAlertToggle={handleCustomTradeAlertToggle}
          theme={theme}
        />

        {customTradeAlert && (
          <StrategySection
            strategyList={strategyList}
            selectedStrategyIndexes={selectedStrategyIndexes}
            noStrategySelected={noStrategySelected}
            hasEmptyConfig={hasEmptyConfig}
            isSaveDisabled={isSaveDisabled}
            isLoading={isLoading}
            onToggleStrategy={toggleStrategy}
            onUpdateDailyAlert={updateDailyAlert}
            onSave={handleSave}
            theme={theme}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
});
