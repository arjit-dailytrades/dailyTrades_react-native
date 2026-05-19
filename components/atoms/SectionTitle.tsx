import { StyleSheet, Text } from "react-native";

interface SectionTitleProps {
  label: string;
  theme: Record<string, string>;
}

export default function SectionTitle({ label, theme }: SectionTitleProps) {
  return (
    <Text style={[styles.sectionTitle, { color: theme.primary }]}>{label}</Text>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 16,
  },
});
