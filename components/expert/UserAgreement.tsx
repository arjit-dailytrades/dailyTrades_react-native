// components/expert/UserAgreement.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const clauses = [
  {
    title: "1. Acceptance of Terms",
    body: "By using this platform, you agree to be bound by these terms and conditions. If you do not agree, please discontinue use immediately.",
  },
  {
    title: "2. Services Provided",
    body: "The platform provides investment advisory services. All recommendations are for informational purposes only and do not constitute financial advice.",
  },
  {
    title: "3. User Obligations",
    body: "You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others.",
  },
  {
    title: "4. Intellectual Property",
    body: "All content on this platform, including text, graphics, and data, is the property of the platform and protected by applicable copyright laws.",
  },
  {
    title: "5. Limitation of Liability",
    body: "The platform shall not be liable for any direct, indirect, or consequential loss arising from use of the services or reliance on any recommendations.",
  },
  {
    title: "6. Privacy Policy",
    body: "Your personal data is collected and processed in accordance with our Privacy Policy. By using the platform, you consent to such processing.",
  },
  {
    title: "7. Amendments",
    body: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.",
  },
  {
    title: "8. Governing Law",
    body: "These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.",
  },
];

export default function UserAgreement() {
  const theme = useAppTheme();
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>
          User Agreement
        </Text>
        <Text style={[styles.body, { color: theme.subText }]}>
          Please read this agreement carefully before using our services. Last
          updated: January 2025.
        </Text>
      </View>

      {clauses.map((clause, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: theme.cardBg }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            {clause.title}
          </Text>
          <Text style={[styles.body, { color: theme.subText }]}>
            {clause.body}
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  body: {
    fontSize: 13,
    lineHeight: 22,
  },
});
