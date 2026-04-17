import { requestOtp } from "@/redux/slice/authSlice";
import { AppDispatch } from "@/redux/store";
import { showError } from "@/utils/toast";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
const SITE_KEY_V3 = process.env.EXPO_PUBLIC_GC_SITE_KEY_v3;
const SITE_KEY_V2 = process.env.EXPO_PUBLIC_GC_SITE_KEY_v2;

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: any) => state.auth.loading);
  const [showRetry, setShowRetry] = useState(false);
  const [mobile, setMobile] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [useV2, setUseV2] = useState(false);
  const [captchaAttempts, setCaptchaAttempts] = useState(0);

  const handleMobileChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 10) setMobile(cleaned);
  };

  const isValid = mobile.length === 10 && agreed;

  const handleContinuePress = () => {
    if (!isValid) return;
    setCaptchaVisible(true);
  };

  // const handleCaptchaMessage = async (event: any) => {
  //   const token = event.nativeEvent.data;
  //   setCaptchaVisible(false);

  //   try {
  //     await dispatch(
  //       requestOtp({
  //         mobile: mobile,
  //         v3Token: token,
  //       }),
  //     ).unwrap();

  //     router.push({
  //       pathname: "/(auth)/verify",
  //       params: { mobile: `+91${mobile}` },
  //     });
  //   } catch (err) {
  //     console.log("OTP ERROR", err);
  //   }
  // };

  const handleCaptchaMessage = async (event: any) => {
    const token = event.nativeEvent.data;
    setCaptchaVisible(false);

    try {
      await dispatch(
        requestOtp({
          mobile,
          v3Token: useV2 ? undefined : token,
          v2Token: useV2 ? token : undefined,
        }),
      ).unwrap();

      // ✅ reset
      setUseV2(false);
      setCaptchaAttempts(0);
      setShowRetry(false);

      router.push({
        pathname: "/(auth)/verify",
        params: { mobile: `+91${mobile}` },
      });
    } catch (err: any) {
      console.log("OTP ERROR", err);

      // 🔥 v3 fail → v2
      if (!useV2) {
        setTimeout(() => {
          setUseV2(true);
          setCaptchaVisible(true); // Fir se naye state ke saath kholein
        }, 500);
        return;
      }

      // 🔥 v2 fail
      if (useV2) {
        const attempts = captchaAttempts + 1;
        setCaptchaAttempts(attempts);

        if (attempts >= 2) {
          showError("Too many attempts. Please try again.");
          setShowRetry(true);
          setUseV2(false);
          return;
        }

        showError("Captcha failed. Try again.");
        setCaptchaVisible(true);
      }
    }
  };
  const theme = {
    bgGradient: isDark ? ["#001D4A", "#000814"] : ["#F0F4F8", "#FFFFFF"],
    cardBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)",
    cardBorder: isDark
      ? "rgba(255, 255, 255, 0.12)"
      : "rgba(255, 255, 255, 0.5)",
    textMain: isDark ? "#FFFFFF" : "#1A1A1A",
    textSub: isDark ? "#AAAAAA" : "#666666",
    inputBg: isDark ? "rgba(255,255,255,0.05)" : "#F8F9FA",
    inputBorder: isDark ? "#333" : "#CCCCCC",
  };

  const getV2Html = (siteKey: string | undefined) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <style>
      body { 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        margin: 0; 
        padding: 0; 
        background-color: transparent; 
      }
      #captcha-container { transform: scale(1.1); } /* Mobile par thoda bada dikhne ke liye */
    </style>
  </head>
  <body>
    <div id="captcha-container">
      <div class="g-recaptcha" 
           data-sitekey="${siteKey}" 
           data-callback="onVerify">
      </div>
    </div>
    <script>
      function onVerify(token) {
        window.ReactNativeWebView.postMessage(token);
      }
    </script>
  </body>
  </html>
`;

  const getV3Html = (siteKey: string | undefined) => `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
    <script>
      function onLoad() {
        grecaptcha.ready(function() {
          grecaptcha.execute('${siteKey}', {action: 'submit'})
          .then(function(token) {
            window.ReactNativeWebView.postMessage(token);
          });
        });
      }
    </script>
  </head>
  <body onload="onLoad()"></body>
  </html>
`;
  return (
    <LinearGradient colors={theme.bgGradient as any} style={styles.container}>
      <StatusBar barStyle="light-content" />
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
                source={
                  isDark
                    ? require("../../assets/images/appLogo.png")
                    : require("../../assets/images/logo.webp")
                }
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </SafeAreaView>

          <View
            style={[
              styles.bottomCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={[styles.loginTitle, { color: theme.textMain }]}>
              Log In
            </Text>
            <Text style={[styles.loginSubtitle, { color: theme.textSub }]}>
              Welcome back! Please log in to proceed.
            </Text>

            {/* Mobile Input */}
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}
            >
              <Image
                source={{ uri: "https://flagcdn.com/w40/in.png" }}
                style={styles.flag}
              />
              <Text style={[styles.code, { color: theme.textMain }]}>+91</Text>

              <TextInput
                keyboardType="number-pad"
                placeholder="Mobile Number"
                placeholderTextColor={isDark ? "#555" : "#ADB5BD"}
                value={mobile}
                onChangeText={handleMobileChange}
                style={[styles.input, { color: theme.textMain }]}
                maxLength={10}
                editable={!loading}
              />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              disabled={!isValid || loading}
              onPress={handleContinuePress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isValid && !loading
                    ? ["#007AFF", "#0040FF"]
                    : ["#2C2C2C", "#1A1A1A"]
                }
                style={styles.continueButton}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.continueText}>Continue</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
            {showRetry && (
              <TouchableOpacity
                onPress={() => {
                  setCaptchaAttempts(0);
                  setUseV2(false);
                  setShowRetry(false);
                  setCaptchaVisible(true);
                }}
                style={styles.checkboxContainer}
              >
                <Text style={[styles.checkboxLabel, { color: "#007AFF" }]}>
                  Retry Verification
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreed(!agreed)}
              disabled={loading}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: theme.textSub },
                  agreed && styles.checkboxChecked,
                ]}
              >
                {agreed && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </View>
              <Text style={[styles.checkboxLabel, { color: theme.textSub }]}>
                I agree to the terms & privacy Policy
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View
                style={[styles.line, { backgroundColor: theme.inputBorder }]}
              />
              <Text style={[styles.dividerText, { color: theme.textSub }]}>
                Or
              </Text>
              <View
                style={[styles.line, { backgroundColor: theme.inputBorder }]}
              />
            </View>

            {/* Social Buttons */}
            <TouchableOpacity
              style={[styles.socialButton, { borderColor: theme.inputBorder }]}
              disabled={loading}
            >
              <FontAwesome5
                name="google"
                size={18}
                color="#EA4335"
                style={styles.socialIcon}
              />
              <Text
                style={[styles.socialButtonText, { color: theme.textMain }]}
              >
                Continue With Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { borderColor: theme.inputBorder }]}
              disabled={loading}
            >
              <Ionicons
                name="logo-apple"
                size={20}
                color={isDark ? "white" : "black"}
                style={styles.socialIcon}
              />
              <Text
                style={[styles.socialButtonText, { color: theme.textMain }]}
              >
                Continue With Apple
              </Text>
            </TouchableOpacity>

            <Text style={[styles.footerText, { color: theme.textSub }]}>
              I am over 18 & also agree to{" "}
              <Text style={[styles.linkText, { color: theme.textSub }]}>
                T&C and Privacy Policy
              </Text>
            </Text>
          </View>

          {/* CAPTCHA MODAL */}
          <Modal
            visible={captchaVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setCaptchaVisible(false)}
          >
            {/* Modal Background Overlay */}
            <View style={styles.modalOverlay}>
              {/* Modal Content (Bottom Card) */}
              <View
                style={[
                  styles.captchaSheet,
                  { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
                ]}
              >
                {/* Close Indicator/Handle (Optional) */}
                <View style={styles.modalHandle} />

                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.textMain }]}>
                    Verification Required
                  </Text>
                  <TouchableOpacity onPress={() => setCaptchaVisible(false)}>
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color={theme.textSub}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.webViewWrapper}>
                  <WebView
                    key={useV2 ? "v2-active" : "v3-active"}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => (
                      <ActivityIndicator
                        size="large"
                        style={{ marginTop: 50 }}
                      />
                    )}
                    source={{
                      html: useV2
                        ? getV2Html(SITE_KEY_V2)
                        : getV3Html(SITE_KEY_V3),
                    }}
                    onMessage={handleCaptchaMessage}
                    style={{ flex: 1 }}
                    // v2 ke liye extra precaution
                    mixedContentMode="always"
                    onHttpError={(syntheticEvent) => {
                      const { nativeEvent } = syntheticEvent;
                      console.warn("WebView HTTP error: ", nativeEvent);
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  topSection: {
    alignItems: "center",
    paddingTop: height * 0.1,
    marginBottom: 40,
  },
  logoWrapper: { alignItems: "center" },
  logoImage: { width: 200, height: 100, resizeMode: "contain" },

  brandText: { fontSize: 32, fontWeight: "bold", marginTop: 5 },
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
  },
  loginTitle: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  loginSubtitle: {
    textAlign: "center",
    marginBottom: 30,
    marginTop: 5,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    marginBottom: 15,
  },
  flag: { width: 24, height: 16, marginRight: 10 },
  code: { fontSize: 16, fontWeight: "600", marginRight: 10 },
  input: { flex: 1, fontSize: 16, borderRadius: 30 },
  continueButton: {
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: { color: "white", fontWeight: "bold", fontSize: 16 },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  checkboxLabel: { fontSize: 13 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  line: { flex: 1, height: 1 },
  dividerText: { paddingHorizontal: 15, fontSize: 12 },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 10,
  },
  socialIcon: { marginRight: 15 },
  socialButtonText: { fontSize: 15, fontWeight: "500" },
  footerText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 5,
    color: "#ffff",
    marginBottom: 10,
  },
  linkText: { textDecorationLine: "underline" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dark semi-transparent background
    justifyContent: "flex-end", // Content ko bottom mein push karega
  },
  captchaSheet: {
    width: "100%",
    height: height * 0.6, // Screen ka 60% height (image jaisa)
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  webViewWrapper: {
    height: 450,
    width: "100%",
    backgroundColor: "transparent",
    marginTop: 10,
    flex: 1,
    overflow: "hidden",
    borderRadius: 15,
  },
});
