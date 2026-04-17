import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { setUser } from "@/redux/slice/authSlice";
import { RootState, store } from "@/redux/store";
import { getLtpData, initWebsocket } from "@/services/socketService";
import { getUpdatedProfile, isAuthenticated } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";

function Navigation() {
  const segments = useSegments();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    initWebsocket(user);

    const interval = setInterval(() => {
      const data = getLtpData();
      // console.log("LTP DATA", data);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const loadData = async () => {
      const userInfo = await isAuthenticated();

      if (userInfo?.user) {
        dispatch(setUser(userInfo?.user));

        const latestUser = await getUpdatedProfile(userInfo?.user);
        if (latestUser) dispatch(setUser(latestUser));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("t");

      setToken(storedToken);
      setLoading(false);
    };

    checkToken();
  }, []);

  if (loading) return null;

  const inAuthGroup = segments[0] === "(auth)";

  // Auth Guard Logic
  if (!token && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  if (token && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="expertPastPerformance"
        options={{
          title: "Past Performance",
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="premiumTools"
        options={{
          title: "Premium Tools",
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="myOrders"
        options={{
          title: "My Orders",
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="myTrades"
        options={{
          title: "My Trades",
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: "Help & Support",
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="transactions"
        options={{
          title: "My Transaction",
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="Subscription"
        options={{
          title: "My Subscription",
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image
            source={require("../assets/images/topBG.png")}
            style={styles.topBgImage}
            contentFit="cover"
          />

          <Image
            source={require("../assets/images/Vector.png")}
            style={styles.vectorImage}
            contentFit="cover"
          />
        </View>

        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <Navigation />
        </View>
      </View>

      <StatusBar style={isDark ? "light" : "dark"} />
      <Toast />
    </ThemeProvider>
  );
}
export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  topBgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },

  vectorImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    opacity: 0.5,
  },
});

// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/use-color-scheme";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <Stack>
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen
//             name="modal"
//             options={{ presentation: "modal", title: "Modal" }}
//           />
//         </Stack>
//         <StatusBar style="auto" />
//       </ThemeProvider>
//   );
// }
