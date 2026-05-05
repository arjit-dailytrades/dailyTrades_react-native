import PageHeader from "@/components/common/PageHeader";
import Card from "@/components/profile/card";
import UserDetailCard from "@/components/profile/userDetailCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getProfile } from "@/redux/slice/profileSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

function profile() {
  const { profile } = useSelector((state: RootState) => state.profile);
  const theme = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const data = [
    {
      section: "Info Center",
      items: [
        {
          title: "PAN KYC",
          subtitle: "Tap to Complete",
          button: "Start",
          icon: "credit-card",
        },
        {
          title: "Refer",
          subtitle: "Refer & Earn",
          button: "Coming soon",
          icon: "users",
        },
      ],
    },
    {
      section: "Actions Center",
      items: [
        {
          title: "Update Email",
          subtitle: "Tap to update your email",
          button: "Update Email",
          icon: "mail",
        },
        {
          title: "Update Password",
          subtitle: "Tap to update password",
          button: "Update Password",
          icon: "lock",
        },
        {
          title: "Control Center",
          subtitle: "Limits for responsible trading",
          button: "Coming soon",
          icon: "file-text",
        },
        {
          title: "Statements & Certificate",
          subtitle: "For ledger and TDS certificates",
          button: "Coming soon",
          icon: "file",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <PageHeader title="Profile" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={require("../assets/images/topBG.png")}
          style={styles.bgImage}
          contentFit="cover"
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <UserDetailCard user={profile} />
        {data.map((item, index) => (
          <View>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              {item.section}
            </Text>
            {item.items.map((val, idx) => (
              <Card val={val} />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default profile;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: {
    padding: 16,
  },

  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },

  sectionTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
});
