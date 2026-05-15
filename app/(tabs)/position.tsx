import { CommonHeader } from "@/components/common/CommonHeader";
import TopBackground from "@/components/common/TopBackground";
import ExpertPlanCard from "@/components/organisms/ExpertPlanCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Position() {
  const theme = useAppTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.bg,
      }}
    >
      <TopBackground />
      <CommonHeader
        profileImageUri="https://picsum.photos/200/300"
        onPremiumPress={() => console.log("Premium Clicked")}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <ExpertPlanCard />
        <Text style={{ fontSize: 18, color: "#333" }}>Position Screen</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Position;
