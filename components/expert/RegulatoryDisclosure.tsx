// components/expert/RegulatoryDisclosures.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function RegulatoryDisclosures() {
  const theme = useAppTheme();
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>
          Regulatory Disclosures
        </Text>
        <Text style={[styles.body, { color: theme.subText }]}>
          This advisor is registered with SEBI as an Investment Adviser under
          the SEBI (Investment Advisers) Regulations, 2013. All recommendations
          are made in compliance with applicable laws and regulations.
        </Text>

        <View
          style={[styles.divider, { backgroundColor: theme.glassBorder }]}
        />

        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Registration Details
        </Text>
        <Row label="SEBI Registration No." value="INA000XXXXXX" theme={theme} />
        <Row label="Type" value="Individual Investment Adviser" theme={theme} />
        <Row label="Validity" value="Perpetual" theme={theme} />
        <Row label="Principal Regulator" value="SEBI" theme={theme} />

        <View
          style={[styles.divider, { backgroundColor: theme.glassBorder }]}
        />

        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Disclosures
        </Text>
        <Text style={[styles.body, { color: theme.subText }]}>
          • The advisor does not hold any personal positions in the securities
          recommended.{"\n\n"}• Past performance is not indicative of future
          results.{"\n\n"}• Investors are advised to read all risk disclosures
          before investing.
        </Text>
      </View>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.subText }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLabel: { fontSize: 13 },
  rowValue: { fontSize: 13, fontWeight: "500" },
});
