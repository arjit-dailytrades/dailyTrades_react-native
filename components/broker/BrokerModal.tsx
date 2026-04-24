import { getBroker, getBrokerCredential } from "@/redux/slice/linkBrokerSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ZerodhaSetup from "./ZarodhaSetup";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const BROKER_ASSETS: { [key: string]: { name: string; icon: any } } = {
  ZERODHA: {
    name: "Zerodha",
    icon: require("../../assets/images/zerodha.png"),
  },
  DHAN: {
    name: "Dhan",
    icon: require("../../assets/images/dhan.png"),
  },
  ANGELOne: {
    name: "Angel One",
    icon: require("../../assets/images/angelone.png"),
  },
  UPSTOX: {
    name: "Upstox",
    icon: require("../../assets/images/UPSTOX.png"),
  },
  FYERS: {
    name: "Fyers",
    icon: require("../../assets/images/fyers.jpg"),
  },
};

interface BrokerModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function BrokerModal({ isVisible, onClose }: BrokerModalProps) {
  const scheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const isDark = scheme === "dark";
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);

  const { brokerList, isLoadingBroker, brokerCredential } = useSelector(
    (state: RootState) => state.broker,
  );

  useEffect(() => {
    if (isVisible) {
      dispatch(getBroker());
      dispatch(getBrokerCredential());
    }
  }, [isVisible]);

  // Handle Deep Links (Dhan & Zerodha)
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const parsed = Linking.parse(event.url);
      const { path, queryParams } = parsed;

      // 1. DHAN CALLBACK
      if (path === "auth-callback" && queryParams?.tokenId) {
        handleDhanExchange(queryParams.tokenId, queryParams.consentId);
      }

      // 2. ZERODHA CALLBACK
      if (path === "kite-callback" && queryParams?.request_token) {
        handleZerodhaExchange(queryParams.request_token);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, [dispatch]);

  const handleDhanExchange = async (tokenId: any, consentId: any) => {
    try {
      const token = await AsyncStorage.getItem("t");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_S_TO_S_API_BASE}/broker/dhan/exchange-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenId, consentId }),
        },
      );
      if (response.ok) finalizeConnection();
    } catch (error) {
      console.error(error);
    }
  };

  const handleZerodhaExchange = async (requestToken: any) => {
    try {
      const stored = await AsyncStorage.getItem("kite_credentials");
      if (!stored) return;
      const parsedStored = JSON.parse(stored);
      const token = await AsyncStorage.getItem("t");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_S_TO_S_API_BASE}/broker/kite/exchange-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...parsedStored, requestToken }),
        },
      );
      if (response.ok) {
        await AsyncStorage.removeItem("kite_credentials");
        finalizeConnection();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const finalizeConnection = () => {
    WebBrowser.dismissBrowser();
    dispatch(getBrokerCredential());
    setSelectedBroker(null);
    onClose();
  };
  const handleBrokerLogin = async (item: any) => {
    try {
      if (item.brokerId === "DHAN") {
        const token = await AsyncStorage.getItem("t");
        if (!token) return;

        // Note: Backend ko pata chalna chahiye ki redirect app par bhejna hai.
        // Isliye 'state' parameter mein 'mobile' bhejna ek standard practice hai.
        const res = await fetch(
          // `${process.env.EXPO_PUBLIC_S_TO_S_API_BASE}/broker/dhan/login?platform=mobile`,
          `${process.env.EXPO_PUBLIC_S_TO_S_API_BASE}/broker/dhan/login`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await res.json();

        if (data?.consentUrl) {
          // Browser open karein
          await WebBrowser.openBrowserAsync(data.consentUrl);
          // Note: App control yahan ruk jayega jab tak user browser band nahi karta
        }
      }
    } catch (error) {
      console.error("Broker Login Error:", error);
    }
  };
  const handleBrokerPress = (item: any) => {
    if (item.brokerId === "ZERODHA") {
      setSelectedBroker("ZERODHA");
    } else {
      handleBrokerLogin(item);
    }
  };
  const handleAuthorize = async (url: string) => {
    // console.log(url, "============urla");

    await WebBrowser.openBrowserAsync(url);
  };
  const renderBroker = ({ item }: { item: any }) => {
    const asset = BROKER_ASSETS[item.brokerId] || {
      name: item.brokerName,
      icon: null,
    };
    // Check if connected from Redux state
    const isConnected = brokerCredential?.some(
      (bc: any) => bc.brokerId === item.brokerId,
    );
    // const isConnected = true;
    console.log("brokerCredential:", brokerCredential);

    return (
      <TouchableOpacity
        style={styles.brokerItem}
        onPress={() => handleBrokerPress(item)}
      >
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
            },
            isConnected && { borderColor: "#4ADE80", borderWidth: 1.5 },
          ]}
        >
          <Image
            source={asset.icon}
            style={styles.brokerIcon}
            resizeMode="contain"
          />
          {isConnected && (
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedText}>
                <MaterialIcons name="done" size={14} color="white" />
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.brokerName, { color: isDark ? "#E2E8F0" : "#1E293B" }]}
        >
          {asset.name}
        </Text>
        {isConnected && <Text style={styles.statusText}>Connected</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.dismissArea}
          onPress={onClose}
          activeOpacity={1}
        />

        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? "#0A0F1D" : "#FFFFFF" },
          ]}
        >
          <View
            style={[
              styles.handle,
              { backgroundColor: isDark ? "#2D3748" : "#CBD5E1" },
            ]}
          />

          {/* Conditional UI: Form vs List */}
          {selectedBroker === "ZERODHA" ? (
            <View style={{ paddingBottom: 20 }}>
              <ZerodhaSetup onAuthorize={handleAuthorize} />
              <TouchableOpacity
                onPress={() => setSelectedBroker(null)}
                style={styles.backBtn}
              >
                <Text style={styles.backBtnText}>← Back to Brokers</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? "#FFF" : "#0F172A" },
                ]}
              >
                Connect Broker
              </Text>

              {isLoadingBroker ? (
                <ActivityIndicator
                  size="large"
                  color="#3ba5f1"
                  style={{ margin: 40 }}
                />
              ) : (
                <FlatList
                  data={brokerList}
                  keyExtractor={(item) => item._id}
                  numColumns={3}
                  columnWrapperStyle={styles.columnWrapper}
                  renderItem={renderBroker}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No Brokers Available</Text>
                  }
                />
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  dismissArea: { flex: 1 },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: SCREEN_HEIGHT * 0.4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 15,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 25 },
  columnWrapper: { justifyContent: "flex-start", gap: 20 },
  brokerItem: {
    width: (SCREEN_WIDTH - 80) / 3,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  brokerIcon: { width: 45, height: 45 },
  brokerName: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  connectedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#4ADE80",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  connectedText: { color: "white", fontSize: 12, fontWeight: "bold" },
  statusText: {
    fontSize: 10,
    color: "#4ADE80",
    fontWeight: "700",
    marginTop: 2,
  },
  backBtn: { marginTop: 15, padding: 10, alignSelf: "center" },
  backBtnText: { color: "#3ba5f1", fontWeight: "600" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
});
