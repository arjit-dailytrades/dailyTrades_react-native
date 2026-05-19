import PageHeader from "@/components/common/PageHeader";
import TopBackground from "@/components/common/TopBackground";
import SettingsSection from "@/components/organisms/SettingsSection";
import { useAppTheme } from "@/hooks/use-app-theme";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <TopBackground />
      <PageHeader title="Settings" />
      <SettingsSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
  },
});
