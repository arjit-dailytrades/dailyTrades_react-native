// components/expert/InvestorCharter.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const rights = [
  "Receive honest, fair and transparent service.",
  "Get advice that is in your best interest.",
  "Be informed about risks before investing.",
  "Access your investment records at any time.",
  "Lodge a grievance and receive a timely resolution.",
  "Receive clear and complete information about fees.",
];

const responsibilities = [
  "Provide accurate personal and financial information.",
  "Read all documents and disclosures carefully.",
  "Report any unauthorized transactions immediately.",
  "Keep your login credentials secure and confidential.",
  "Understand the risk profile of investments you choose.",
];

export default function InvestorCharter() {
  const theme = useAppTheme();
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Rights */}
      <View style={[styles.card]}>
        <Text style={[styles.title, { color: theme.textColor }]}>
          Investor Charter
        </Text>
        <Text style={[styles.body, { color: theme.subText }]}>
          As an investor, you are entitled to the following rights and are
          expected to uphold these responsibilities.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Your Rights
        </Text>
        {rights.map((item, index) => (
          <BulletRow key={index} text={item} theme={theme} />
        ))}
      </View>

      {/* Responsibilities */}
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Your Responsibilities
        </Text>
        {responsibilities.map((item, index) => (
          <BulletRow key={index} text={item} theme={theme} />
        ))}
      </View>

      {/* Grievance */}
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Grievance Redressal
        </Text>
        <Text style={[styles.body, { color: theme.subText }]}>
          In case of any grievance, please contact our support team. If
          unresolved, you may escalate to SEBI via the SCORES portal at{" "}
          <Text style={{ color: "#0068FF" }}>scores.sebi.gov.in</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

function BulletRow({ text, theme }: { text: string; theme: any }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bullet, { color: "#0068FF" }]}>•</Text>
      <Text style={[styles.bulletText, { color: theme.subText }]}>{text}</Text>
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
  },
  body: {
    fontSize: 13,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 22,
    flex: 1,
  },
});
