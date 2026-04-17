import { useColorScheme } from "@/hooks/use-color-scheme";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: isDark ? "#000" : "#fff",
        tabBarInactiveTintColor: isDark ? "#bbb" : "#666",

        tabBarStyle: [
          styles.tabBarContainer,
          {
            bottom: insets.bottom,
          },
        ],

        tabBarBackground: () => (
          <LinearGradient
            colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.02)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.borderGradient}
          >
            <LinearGradient
              colors={["rgba(20,20,20,0.6)", "rgba(20,20,20,0.9)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.innerBackground}
            />
          </LinearGradient>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeCircle]}>
              <Feather name="home" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="expert"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeCircle]}>
              <FontAwesome name="tripadvisor" size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeCircle]}>
              <AntDesign name="transaction" size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeCircle]}>
              <Feather name="user" size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeCircle]}>
              <Feather name="settings" size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    marginHorizontal: "5%",
    width: "90%",
    height: 70,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  borderGradient: {
    flex: 1,
    borderRadius: 40,
    padding: 1, // 👈 important (border thickness)
  },

  innerBackground: {
    flex: 1,
    borderRadius: 40,
  },
  glassBackground: {
    flex: 1,
    borderRadius: 40,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: Platform.select({
      ios: 5,
      android: 20,
    }),
  },
  activeCircle: {
    backgroundColor: "#3ba5f1",
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 5,
  },
});
