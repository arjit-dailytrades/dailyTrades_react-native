import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppHeader({ title }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#000000";

  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const translateX = useRef(new Animated.Value(-260)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText) console.log("Searching:", searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const toggleSearch = () => {
    const toValue = searchOpen ? -260 : 0;

    Animated.timing(translateX, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();

    if (searchOpen) setSearchText("");
    setSearchOpen(!searchOpen);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Animated.View
          style={{
            opacity: translateX.interpolate({
              inputRange: [-260, 0],
              outputRange: [1, 0],
            }),
          }}
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={[styles.logo, isDark && { tintColor: "#fff" }]}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.centerSection,
            {
              opacity: translateX.interpolate({
                inputRange: [-260, 0],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.searchWrapper,
            {
              transform: [{ translateX }],
              opacity: translateX.interpolate({
                inputRange: [-260, 0],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <View
            style={[
              styles.searchBox,
              {
                borderColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
          >
            <Ionicons name="search" size={18} color={textColor} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search..."
              placeholderTextColor={isDark ? "#888" : "#666"}
              style={[styles.input, { color: textColor }]}
              autoFocus={searchOpen}
            />
          </View>
        </Animated.View>

        {/* RIGHT ICONS */}
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
            <Ionicons
              name={searchOpen ? "close" : "search"}
              size={22}
              color={textColor}
            />
          </TouchableOpacity>

          {!searchOpen && (
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={20} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingHorizontal: 15,
  },
  centerSection: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  logo: {
    width: 90,
    height: 35,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  iconButton: {
    marginLeft: 12,
  },

  searchWrapper: {
    position: "absolute",
    left: 0,
    right: 90,
    paddingHorizontal: 15,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(150,150,150,0.1)",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 36,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
});
