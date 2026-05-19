import StrategyCard, {
    Strategy,
} from "@/components/organisms/StrategyNotificationCard";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SectionTitle from "../atoms/SectionTitle";

interface StrategySectionProps {
  strategyList: Strategy[];
  selectedStrategyIndexes: Set<number>;
  noStrategySelected: boolean;
  hasEmptyConfig: boolean;
  isSaveDisabled: boolean;
  isLoading: boolean;
  onToggleStrategy: (idx: number) => void;
  onUpdateDailyAlert: (stratIdx: number, cfgIdx: number, value: number) => void;
  onSave: () => void;
  theme: Record<string, string>;
}

export default function StrategySection({
  strategyList,
  selectedStrategyIndexes,
  noStrategySelected,
  hasEmptyConfig,
  isSaveDisabled,
  isLoading,
  onToggleStrategy,
  onUpdateDailyAlert,
  onSave,
  theme,
}: StrategySectionProps) {
  return (
    <>
      <SectionTitle label="SELECT STRATEGIES" theme={theme} />

      {noStrategySelected && (
        <View
          style={[
            styles.warningBanner,
            { backgroundColor: `${theme.warning}22` },
          ]}
        >
          <Text style={[styles.warningText, { color: theme.warning }]}>
            ⚠ Please select at least one strategy.
          </Text>
        </View>
      )}

      {strategyList.map((strategy, idx) => (
        <StrategyCard
          key={strategy.segment}
          strategy={strategy}
          index={idx}
          isSelected={selectedStrategyIndexes.has(idx)}
          onToggle={onToggleStrategy}
          onUpdateDailyAlert={onUpdateDailyAlert}
          theme={theme}
        />
      ))}

      {hasEmptyConfig && (
        <View
          style={[
            styles.warningBanner,
            { backgroundColor: `${theme.warning}22` },
          ]}
        >
          <Text style={[styles.warningText, { color: theme.warning }]}>
            ⚠ Set at least 1 daily alert per selected strategy.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.saveBtn,
          {
            backgroundColor: isSaveDisabled ? theme.subText : theme.primary,
          },
        ]}
        onPress={onSave}
        disabled={isSaveDisabled}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  warningBanner: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 13,
    fontWeight: "500",
  },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
