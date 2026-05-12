import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import AvatarAtom from "../atoms/AvtarAtom";
import IconButton from "../common/IconButton";

const { width } = Dimensions.get("window");

interface StatCardProps {
  iconName: string;
  iconType?: "Material" | "Ionicons";
  value: string;
  label: string;
  theme: ReturnType<typeof useAppTheme>;
  isDark: boolean;
}

const StatCard = ({
  iconName,
  iconType,
  value,
  label,
  theme,
  isDark,
}: StatCardProps) => {
  const IconComponent =
    iconType === "Material" ? MaterialCommunityIcons : Ionicons;

  return (
    <BlurView
      intensity={isDark ? 30 : 50}
      tint={isDark ? "dark" : ("light" as const)}
      style={[
        styles.statCard,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor,
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.2 : 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: isDark ? 0 : 4,
        },
      ]}
    >
      <IconComponent name={iconName as any} size={22} color={theme.primary} />

      <View style={{ marginTop: 10 }}>
        <Text style={[styles.statValue, { color: theme.textColor }]}>
          {value}
        </Text>
        <Text style={[styles.statLabel, { color: theme.subText }]}>
          {label}
        </Text>
      </View>
    </BlurView>
  );
};

export default function ExpertPerformanceDetails() {
  const router = useRouter();
  const theme = useAppTheme();
  const isDark = useColorScheme() === "dark";

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: theme.iconBg }]}
        >
          <Ionicons name="arrow-back" color={theme.iconColor} size={22} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: theme.iconBg }]}
          >
            <Ionicons
              name="share-social-outline"
              color={theme.iconColor}
              size={22}
            />
          </TouchableOpacity>
          <IconButton
            icon="heart"
            color="red"
            active
            height={40}
            width={40}
            iconSize={18}
          />

          <TouchableOpacity style={styles.followBtn}>
            <Ionicons name="person-add" color="#fff" size={16} />
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE */}
        <View style={styles.profileSection}>
          <View
            style={[styles.avatarBorder, { borderColor: theme.borderColor }]}
          >
            <AvatarAtom
              name="Manish Shah"
              height={110}
              width={110}
              uri="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200"
            />
          </View>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.textColor }]}>
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
          tint={isDark ? "dark" : "light"}
          style={[
            styles.infoStrip,
            {
              backgroundColor: theme.cardColor,
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
            <Text style={[styles.infoVal, { color: theme.textColor }]}>
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
            <Text style={[styles.infoVal, { color: theme.textColor }]}>
              10+ Years
            </Text>
          </View>
        </BlurView>

        {/* ABOUT */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
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
            theme={theme}
            isDark={isDark}
          />
          <StatCard
            iconName="swap-horizontal"
            iconType="Material"
            value="154"
            label="Total Trades"
            theme={theme}
            isDark={isDark}
          />
          <StatCard
            iconName="trending-up"
            value="120"
            label="Target Hit"
            theme={theme}
            isDark={isDark}
          />
          <StatCard
            iconName="trending-down"
            value="34"
            label="Stop Loss"
            theme={theme}
            isDark={isDark}
          />
          <StatCard
            iconName="card-outline"
            value="₹45k"
            label="Avg Profit"
            theme={theme}
            isDark={isDark}
          />
          <StatCard
            iconName="people-outline"
            value="12.4k"
            label="Followers"
            theme={theme}
            isDark={isDark}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  headerRight: { flexDirection: "row", gap: 12 },

  iconBtn: {
    width: 40,
    height: 40,
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
  },

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
