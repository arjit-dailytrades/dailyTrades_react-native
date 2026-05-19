import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ─── types ────────────────────────────────────────────────────────────────────

export interface SegmentConfig {
  rr: string;
  riskRewardValue: number;
  condition: "LT" | "GTE";
  dailyAlert: number;
}

export interface Strategy {
  name: string;
  segment: string;
  config: SegmentConfig[];
}

export interface StrategyCardProps {
  strategy: Strategy;
  index: number;
  isSelected: boolean;
  onToggle: (idx: number) => void;
  onUpdateDailyAlert: (stratIdx: number, cfgIdx: number, value: number) => void;
  theme: Record<string, string>;
}

// ─── component ────────────────────────────────────────────────────────────────

export default function StrategyCard({
  strategy,
  index,
  isSelected,
  onToggle,
  onUpdateDailyAlert,
  theme,
}: StrategyCardProps) {
  return (
    <View
      style={[
        styles.strategyCard,
        { backgroundColor: theme.cardColor, borderColor: theme.borderColor },
      ]}
    >
      {/* ── header: checkbox + name ── */}
      <TouchableOpacity
        style={styles.strategyHeader}
        onPress={() => onToggle(index)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.strategyCheckbox,
            {
              borderColor: isSelected ? theme.primary : theme.borderColor,
              backgroundColor: isSelected ? theme.primary : "transparent",
            },
          ]}
        >
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.strategyName, { color: theme.textColor }]}>
          {strategy.name}
        </Text>
      </TouchableOpacity>

      {/* ── expanded config rows (only when selected) ── */}
      {isSelected && (
        <View
          style={[styles.strategyConfig, { borderTopColor: theme.borderColor }]}
        >
          {strategy.config.map((cfg, cfgIdx) => (
            <View key={cfg.condition} style={styles.configRow}>
              {/* R:R label */}
              <Text style={[styles.configLabel, { color: theme.textColor }]}>
                R:R{" "}
                <Text style={[styles.configRR, { color: theme.primary }]}>
                  {cfg.rr}
                </Text>
              </Text>

              {/* counter */}
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={[
                    styles.counterBtn,
                    { backgroundColor: theme.innerBox },
                  ]}
                  onPress={() =>
                    onUpdateDailyAlert(
                      index,
                      cfgIdx,
                      Math.max(0, cfg.dailyAlert - 1),
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.counterBtnText, { color: theme.primary }]}
                  >
                    −
                  </Text>
                </TouchableOpacity>

                <Text style={[styles.counterValue, { color: theme.textColor }]}>
                  {cfg.dailyAlert}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.counterBtn,
                    { backgroundColor: theme.innerBox },
                  ]}
                  onPress={() =>
                    onUpdateDailyAlert(
                      index,
                      cfgIdx,
                      Math.min(3, cfg.dailyAlert + 1),
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.counterBtnText, { color: theme.primary }]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>

              {/* suffix */}
              <Text style={[styles.configSubLabel, { color: theme.subText }]}>
                daily alerts
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── static styles (layout only — colors come from theme prop) ────────────────

const styles = StyleSheet.create({
  strategyCard: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },

  strategyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },

  strategyCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  checkmark: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
    lineHeight: 16,
  },

  strategyName: {
    fontSize: 14,
    fontWeight: "600",
  },

  strategyConfig: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },

  configRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  configLabel: {
    fontSize: 13,
    flex: 1,
    fontWeight: "500",
  },

  configRR: {
    fontWeight: "700",
  },

  configSubLabel: {
    fontSize: 12,
    marginLeft: 8,
    width: 72,
    textAlign: "right",
  },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  counterBtnText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 22,
  },

  counterValue: {
    width: 28,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
  },
});
