import GlowButton from "@/components/common/GlowButton";
import {
  Entypo,
  Feather,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GAP = 10;
const BUTTON_WIDTH = 120;
const TAB_BAR_HEIGHT = 68;
const SIDE_MARGIN = 16;
const TAB_BAR_WIDTH = SCREEN_WIDTH - SIDE_MARGIN * 2 - GAP - BUTTON_WIDTH;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPos = insets.bottom + 10;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,

          tabBarStyle: {
            position: "absolute",
            bottom: bottomPos,
            left: 16,
            width: TAB_BAR_WIDTH,
            height: TAB_BAR_HEIGHT,
            borderRadius: 50,
            borderTopWidth: 0,
            backgroundColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
            paddingHorizontal: 5,
            marginLeft: 15,
          },

          tabBarBackground: () => (
            <BlurView
              intensity={60}
              tint="dark"
              style={{
                flex: 1,
                borderRadius: 50,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[styles.iconWrapper, focused && styles.activeCircle]}
              >
                <Entypo
                  name="home"
                  size={22}
                  color={focused ? "#fff" : "#888"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="expert"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[styles.iconWrapper, focused && styles.activeCircle]}
              >
                <Feather
                  name="users"
                  size={21}
                  color={focused ? "#fff" : "#888"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="position"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[styles.iconWrapper, focused && styles.activeCircle]}
              >
                <MaterialIcons
                  name="shopping-bag"
                  size={24}
                  color={focused ? "#fff" : "#888"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[styles.iconWrapper, focused && styles.activeCircle]}
              >
                <SimpleLineIcons
                  name="handbag"
                  size={20}
                  color={focused ? "#fff" : "#888"}
                />
              </View>
            ),
          }}
        />
      </Tabs>

      <View
        style={[
          styles.buttonContainer,
          {
            bottom: bottomPos,
            right: 15,
            height: TAB_BAR_HEIGHT,
          },
        ]}
        pointerEvents="box-none"
      >
        <GlowButton title="Dailynivesh" buttonWidth={120} buttonHeight={68} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    marginTop: Platform.select({
      ios: 30,
      android: 20,
    }),
  },

  activeCircle: {
    backgroundColor: "#FFFFFF0D",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonContainer: {
    position: "absolute",
    width: BUTTON_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
});
