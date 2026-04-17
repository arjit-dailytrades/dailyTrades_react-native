import { verifyOtp } from "@/redux/slice/authSlice";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

export default function Verify() {
  // --- SAME LOGIC AS BEFORE ---
  const { mobile } = useLocalSearchParams<{ mobile: string }>();
  const dispatch = useDispatch<any>();
  const verifyLoading = useSelector((state: any) => state.auth.verifyLoading);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const { height } = Dimensions.get("window");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    let interval: any;
    if (secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [secondsLeft]);

  const handleResend = () => {
    if (!canResend) return;
    setSecondsLeft(60);
    setCanResend(false);
  };

  const formatTime = (time: number) => {
    const secs = time % 60;
    return `00:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    if (text.length > 1) {
      const pasted = text.substring(0, 6).split("");
      const updatedOtp = [...otp];
      pasted.forEach((digit, i) => {
        if (i < 6) updatedOtp[i] = digit;
      });
      setOtp(updatedOtp);
      inputs.current[Math.min(pasted.length - 1, 5)]?.focus();
      return;
    }
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (text && index === 5) Keyboard.dismiss();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;
    try {
      const cleanMobile = Array.isArray(mobile) ? mobile[0] : mobile;
      const payload = {
        mobile: cleanMobile?.replace("+91", "").trim(),
        otp: otpValue,
      };
      await dispatch(verifyOtp(payload)).unwrap();
      router.replace("/");
    } catch (err) {
      console.log("OTP ERROR", err);
    }
  };

  const handleDifferentMobile = () => {
    router.push("/(auth)/login");
  };

  // --- UI THEME COLORS ---
  const theme = isDark
    ? {
        bg: ["#0B1739", "#060B1A"],
        card: "rgba(255, 255, 255, 0.05)",
        border: "rgba(255, 255, 255, 0.12)",
        text: "#FFFFFF",
        subText: "#9CA3AF",
        inputBg: "rgba(0, 0, 0, 0.3)",
        btnSecondary: "rgba(255,255,255,0.1)",
      }
    : {
        bg: ["#F3F4F6", "#FFFFFF"],
        card: "#FFFFFF",
        border: "#E5E7EB",
        text: "#1A2138",
        subText: "#99A1B7",
        inputBg: "#F8FAFC",
        btnSecondary: "#E4E9F2",
      };

  return (
    <LinearGradient colors={theme.bg as any} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView style={styles.topSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/images/logo.webp")}
                style={styles.logo}
              />
            </View>
          </SafeAreaView>

          <View
            style={[
              styles.bottomCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.title, { color: theme.text }]}>
              Enter code
            </Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>
              OTP sent to
              <Text style={{ color: theme.text, fontWeight: "600" }}>
                {" " + mobile || ""}
              </Text>
            </Text>
            <View style={styles.infoContainer}>
              <Text style={[styles.subtitle, { color: theme.subText }]}>
                If email updated, check your
                <Text style={styles.highlight}> inbox</Text> too.
              </Text>

              <TouchableOpacity onPress={handleDifferentMobile}>
                <Text style={styles.changeNumber}>
                  Use different mobile number
                </Text>
              </TouchableOpacity>
            </View>

            {/* OTP Inputs */}
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref: any) => (inputs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.text,
                      borderColor: otp[index] ? theme.text : theme.border,
                      borderWidth: otp[index] ? 1.5 : 1,
                    },
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  textAlign="center"
                />
              ))}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              disabled={otp.join("").length !== 6 || verifyLoading}
              onPress={handleVerify}
            >
              <LinearGradient
                colors={["#007AFF", "#0040FF"]}
                style={[
                  styles.verifyButton,
                  {
                    opacity: otp.join("").length === 6 ? 1 : 0.6,
                  },
                ]}
              >
                {verifyLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.btnContent}>
                    <Text style={styles.btnText}>VERIFY</Text>
                    <AntDesign name="arrow-right" size={18} color="#fff" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.backButton,
                { backgroundColor: theme.btnSecondary, marginTop: 10 },
              ]}
              onPress={handleDifferentMobile}
            >
              <View style={styles.btnContent}>
                <AntDesign name="arrow-left" size={18} color={theme.text} />
                <Text style={[styles.btnText, { color: theme.text }]}>
                  Back
                </Text>
              </View>
            </TouchableOpacity>

            {/* <View style={styles.resendWrapper}>
              {secondsLeft > 0 ? (
                <Text style={[styles.resendText, { color: theme.subText }]}>
                  Resend code in
                  <Text style={{ color: theme.text, fontWeight: "bold" }}>
                    {formatTime(secondsLeft)}
                  </Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLinkActive}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    paddingTop: height * 0.1,
    marginBottom: 40,
  },
  logoWrapper: { alignItems: "center" },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  infoContainer: {
    alignItems: "center",
    gap: 8,
  },

  infoText: {
    fontSize: 14,
    textAlign: "center",
  },

  highlight: {
    fontWeight: "600",
  },

  changeNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5C59E8",
    textDecorationLine: "underline",
    marginBottom: 35,
  },
  bottomCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 50,
    borderWidth: 1,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  resendWrapper: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  resendContainer: { marginTop: 30 },
  resendText: {
    fontSize: 14,
  },
  resendLinkActive: {
    color: "#F0657D",
    fontWeight: "800",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    fontSize: 12,
    fontWeight: "600",
  },

  verifyButton: {
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
