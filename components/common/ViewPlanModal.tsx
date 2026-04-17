import { RootState } from "@/redux/store";
import { BlurView } from "expo-blur";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function ViewPlanModal({ visible, onClose, selectedKey }: any) {
  const isDark = useColorScheme() === "dark";

  const { subscriptionPlan, isLoadingPlan } = useSelector(
    (state: RootState) => state.expert,
  );

  const theme = {
    overlay: isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.5)",
    bg: isDark ? "#050A1A" : "#FFFFFF",
    border: isDark ? "#FFFFFF1A" : "#0D0D0D1A",
    card: isDark ? "rgba(255, 255, 255, 0.05)" : "#F3F4F6",
    text: isDark ? "#FFFFFF" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666666",
  };

  const plans = subscriptionPlan?.subscriptionPlans || {};
  const activePlan = plans[selectedKey];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <BlurView
          intensity={isDark ? 30 : 10}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.bg, borderColor: theme.border },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Subscription Plans
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: theme.subText, fontSize: 28 }}>×</Text>
            </TouchableOpacity>
          </View>

          {isLoadingPlan ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0068FF" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.planGrid}>
                {Object.keys(plans).map((key) => {
                  const isSelected = key === selectedKey;
                  return (
                    <View
                      key={key}
                      style={[
                        styles.planCard,
                        {
                          backgroundColor: theme.card,
                          borderColor: isSelected ? "#0068FF" : theme.border,
                          borderWidth: isSelected ? 2 : 1,
                          opacity: isSelected ? 1 : 0.6,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.planLabel,
                          { color: isSelected ? "#0068FF" : theme.subText },
                        ]}
                      >
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Text>
                      <Text style={[styles.planPrice, { color: theme.text }]}>
                        ₹{plans[key]?.price}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedText}>PURCHASED</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {activePlan ? (
                <View
                  style={[
                    styles.breakdownContainer,
                    { backgroundColor: theme.card },
                  ]}
                >
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Selected Plan Details
                  </Text>

                  <DetailRow
                    label="Total Trades"
                    value={activePlan.trades}
                    theme={theme}
                  />
                  <DetailRow
                    label="Net Amount"
                    value={`₹${activePlan.sNetAmount?.toFixed(2)}`}
                    theme={theme}
                  />
                  <DetailRow
                    label="GST (18%)"
                    value={`₹${activePlan.sGstAmount?.toFixed(2)}`}
                    theme={theme}
                  />

                  <View
                    style={[styles.divider, { backgroundColor: theme.border }]}
                  />

                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: theme.text }]}>
                      Final Amount
                    </Text>
                    <Text style={styles.totalValue}>
                      ₹{activePlan.finalAmount}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Selected plan details not found.
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const DetailRow = ({ label, value, theme }: any) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, { color: theme.subText }]}>{label}</Text>
    <Text style={[styles.rowValue, { color: theme.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "85%",
    borderRadius: 30,
    borderWidth: 1,
    padding: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "800" },
  closeBtn: { padding: 5 },
  loaderContainer: { height: 200, justifyContent: "center" },
  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  planCard: {
    width: "48%",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: "center",
    position: "relative",
  },
  selectedBadge: {
    position: "absolute",
    top: -8,
    backgroundColor: "#0068FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedText: { color: "#FFF", fontSize: 8, fontWeight: "bold" },
  planLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  planPrice: { fontSize: 18, fontWeight: "800" },
  breakdownContainer: { padding: 20, borderRadius: 24, marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, marginVertical: 15 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 22, fontWeight: "900", color: "#0068FF" },
  buttonWrapper: { alignItems: "center", paddingBottom: 10 },
});
