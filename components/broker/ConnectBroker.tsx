import {
  getBroker,
  getBrokerCredential,
  setOpenLinkBrokerModal,
} from "@/redux/slice/linkBrokerSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BrokerModal from "./BrokerModal";

export default function ConnectBrokerCard() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const dispatch = useDispatch<AppDispatch>();
  const { openLinkBrokerModal, brokerList, brokerCredential } = useSelector(
    (state: RootState) => state.broker,
  );
  const handleModalOpenClose = () => {
    dispatch(setOpenLinkBrokerModal(!openLinkBrokerModal));
  };
  useEffect(() => {
    dispatch(getBroker());
    dispatch(getBrokerCredential());
  }, [openLinkBrokerModal]);

  //   theme
  const theme = {
    lightColors: isDark ? ["#000814", "#001d3d"] : ["#2575fc", "#1a56e8"],
  };
  // console.log("brokerList:", brokerList);
  // console.log("brokerCredential:", brokerCredential);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.lightColors as any}
        style={styles.cardWrapper}
      >
        <Image
          source={require("../../assets/images/UPSTOX.png")}
          style={[
            styles.floatingIcon,
            { top: 30, left: "10%", borderRadius: 50 },
          ]}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/images/angelone.png")}
          style={[
            styles.floatingIcon,
            { top: 2, left: "43%", borderRadius: 50 },
          ]}
        />
        <Image
          source={require("../../assets/images/dhan.png")}
          style={[
            styles.floatingIcon,
            { top: 30, right: "10%", borderRadius: 50 },
          ]}
        />

        <BlurView
          intensity={isDark ? 30 : 0}
          tint="dark"
          style={styles.cardInner}
        >
          <View style={styles.contentRow}>
            {/* Left Circle Icon */}
            <Image
              source={require("../../assets/images/zerodha.png")}
              style={[{ borderRadius: 50, width: 40, height: 40 }]}
            />

            {/* Middle Text and Button */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                Connect your Broker to place Order
              </Text>

              <TouchableOpacity
                style={styles.btn}
                onPress={handleModalOpenClose}
              >
                <LinearGradient
                  colors={
                    isDark ? ["#1a73e8", "#0d47a1"] : ["#ffffff", "#f1f1f1"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btnGradient}
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: isDark ? "#fff" : "#222" },
                    ]}
                  >
                    Link your broker
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Right Side Icon */}
            <View style={styles.rightIconWrapper}>
              <Image
                source={require("../../assets/images/GROWW.jpg")}
                style={styles.rightIcon}
              />
            </View>
          </View>
        </BlurView>
      </LinearGradient>
      <BrokerModal
        isVisible={openLinkBrokerModal}
        onClose={handleModalOpenClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
  },
  cardWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardInner: {
    padding: 10,
    minHeight: 160,
    justifyContent: "flex-end",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  floatingIcon: {
    position: "absolute",
    width: 40,
    height: 40,
  },
  circleIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: "hidden",
  },
  circleGradient: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  btn: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  btnGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  rightIconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  rightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
