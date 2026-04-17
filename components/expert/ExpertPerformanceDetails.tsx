import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ExpertPerformanceDetails() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const theme = {
    bg: isDark ? ["#0f172a", "#020617"] : ["#f8fafc", "#e2e8f0"],

    cardBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.95)",

    text: isDark ? "#f8fafc" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#475569",

    primary: "#3b82f6",

    border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",

    glassTint: isDark ? "dark" : ("light" as const),
  };

  const StatCard = ({ iconName, iconType, value, label }: any) => {
    const IconComponent =
      iconType === "Material" ? MaterialCommunityIcons : Ionicons;

    return (
      <BlurView
        intensity={isDark ? 30 : 50}
        tint={theme.glassTint as any}
        style={[
          styles.statCard,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.border,

            shadowColor: "#000",
            shadowOpacity: isDark ? 0.2 : 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: isDark ? 0 : 4,
          },
        ]}
      >
        <IconComponent name={iconName} size={22} color={theme.primary} />

        <View style={{ marginTop: 10 }}>
          <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
          <Text style={[styles.statLabel, { color: theme.subText }]}>
            {label}
          </Text>
        </View>
      </BlurView>
    );
  };

  return (
    <LinearGradient colors={theme.bg as any} style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.iconBtn,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons
            name="arrow-back"
            color={isDark ? "#fff" : "#000"}
            size={22}
          />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Ionicons
              name="share-outline"
              color={isDark ? "#fff" : "#000"}
              size={22}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.followBtn}>
            <Ionicons name="person-add" color="#fff" size={16} />
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* PROFILE */}
        <View style={styles.profileSection}>
          <View style={styles.avatarBorder}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
              }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.text }]}>
              Manish Shah
            </Text>
            <MaterialCommunityIcons
              name="check-decagram"
              size={20}
              color="#3b82f6"
            />
          </View>

          <Text style={styles.badgeText}>SEBI REGISTERED</Text>

          <Text style={[styles.roleText, { color: theme.subText }]}>
            Research Analyst
          </Text>
        </View>

        {/* INFO STRIP */}
        <BlurView
          intensity={isDark ? 20 : 40}
          tint={theme.glassTint as any}
          style={[
            styles.infoStrip,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              shadowColor: "#000",
              shadowOpacity: isDark ? 0.15 : 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: isDark ? 0 : 2,
            },
          ]}
        >
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>SEBI NO</Text>
            <Text style={[styles.infoVal, { color: theme.text }]}>
              INR 12345699
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
          />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>EXPERIENCE</Text>
            <Text style={[styles.infoVal, { color: theme.text }]}>
              10+ Years
            </Text>
          </View>
        </BlurView>

        {/* ABOUT */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Performance Overview
          </Text>
          <Text style={[styles.aboutText, { color: theme.subText }]}>
            Expert in Nifty and BankNifty options trading with a focus on
            risk-to-reward ratio and technical analysis.
          </Text>
        </View>

        {/* STATS */}
        <View style={styles.statsGrid}>
          <StatCard
            iconName="speedometer-outline"
            value="92.5%"
            label="Accuracy"
          />
          <StatCard
            iconName="swap-horizontal"
            iconType="Material"
            value="154"
            label="Total Trades"
          />
          <StatCard iconName="trending-up" value="120" label="Target Hit" />
          <StatCard iconName="trending-down" value="34" label="Stop Loss" />
          <StatCard iconName="card-outline" value="₹45k" label="Avg Profit" />
          <StatCard iconName="people-outline" value="12.4k" label="Followers" />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 10,
  },

  headerRight: { flexDirection: "row", gap: 12 },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  followBtn: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: "center",
    gap: 8,
  },

  followText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  profileSection: { alignItems: "center", marginTop: 10 },

  avatarBorder: {
    padding: 4,
    borderRadius: 65,
    borderWidth: 2.5,
    borderColor: "#3b82f6",
  },

  avatar: { width: 110, height: 110, borderRadius: 55 },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },

  name: { fontSize: 26, fontWeight: "800" },

  badgeText: {
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 4,
  },

  roleText: { fontSize: 15, marginTop: 4, fontWeight: "500" },

  infoStrip: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },

  infoItem: { flex: 1, padding: 15, alignItems: "center" },

  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#94a3b8",
  },

  infoVal: { fontSize: 14, fontWeight: "bold", marginTop: 4 },

  divider: {
    width: 1,
    marginVertical: 15,
  },

  section: { paddingHorizontal: 25, marginTop: 30 },

  sectionTitle: { fontSize: 20, fontWeight: "bold" },

  aboutText: { fontSize: 14, lineHeight: 22, marginTop: 8 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    justifyContent: "space-between",
    marginTop: 10,
  },

  statCard: {
    width: width / 2 - 25,
    marginBottom: 15,
    padding: 20,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
  },

  statValue: { fontSize: 20, fontWeight: "800" },

  statLabel: { fontSize: 12, fontWeight: "500", marginTop: 2 },
});
