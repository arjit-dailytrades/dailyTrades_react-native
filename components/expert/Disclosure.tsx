// components/expert/Disclosure.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const disclosures = [
  {
    label: "Conflicts of Interest",
    body: "The advisor may have a financial interest in certain securities. All such interests are disclosed at the time of recommendation.",
  },
  {
    label: "Compensation",
    body: "The advisor is compensated through subscription fees paid by clients. No commission or referral fee is received from any third party.",
  },
  {
    label: "Risk Disclosure",
    body: "Investments in securities market are subject to market risks. Read all related documents carefully before investing. Past performance does not guarantee future returns.",
  },
  {
    label: "No Guaranteed Returns",
    body: "The platform and its advisors do not guarantee any returns on investments. All investment decisions are made at the sole discretion of the investor.",
  },
  {
    label: "Data Accuracy",
    body: "While we strive to provide accurate information, we do not warrant the completeness or accuracy of data presented on this platform.",
  },
];

export default function Disclosure() {
  const theme = useAppTheme();
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>
          Disclosure
        </Text>
        <Text style={[styles.body, { color: theme.subText }]}>
          The following disclosures are made in the interest of transparency and
          investor protection.
        </Text>
      </View>

      {disclosures.map((item, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: theme.cardBg }]}
        >
          <View style={styles.labelRow}>
            <View style={styles.dot} />
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              {item.label}
            </Text>
          </View>
          <Text style={[styles.body, { color: theme.subText }]}>
            {item.body}
          </Text>
        </View>
      ))}
    </ScrollView>
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
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0068FF",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  body: {
    fontSize: 13,
    lineHeight: 22,
  },
});
