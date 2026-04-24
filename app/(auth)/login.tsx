import { requestOtp } from "@/redux/slice/authSlice";
import { AppDispatch } from "@/redux/store";
import { showError } from "@/utils/toast";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
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
const BASE_URL = process.env.EXPO_PUBLIC_S_TO_S_API_BASE;

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: any) => state.auth.loading);

  const [mobile, setMobile] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Captcha states
  const [v3Running, setV3Running] = useState(false); // background V3 WebView visible
  const [v2ModalVisible, setV2ModalVisible] = useState(false); // V2 modal visible
  const [v2Key, setV2Key] = useState(0); // V2 reload ke liye
  const [v3Key, setV3Key] = useState(0); // V3 reload ke liye

  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;

  const handleMobileChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 10) setMobile(cleaned);
  };

  const isValid = mobile.length === 10 && agreed;

  // ─── Step 1: Continue press → V3 silently start ───────────────────────────
  const handleContinuePress = () => {
    if (!isValid) return;
    setV3Running(true); // hidden WebView mount hoga, auto execute karega
  };

  // ─── Step 2: V3 token aaya ────────────────────────────────────────────────
  const handleV3Token = async (event: any) => {
    const token = event.nativeEvent.data;
    setV3Running(false); // hidden WebView hatao

    try {
      await dispatch(
        requestOtp({ mobile: mobileRef.current, v3Token: token }),
      ).unwrap();

      router.push({
        pathname: "/(auth)/verify",
        params: { mobile: `+91${mobileRef.current}` },
      });
    } catch (err: any) {
      // V3 fail → V2 modal kholo
      setV2Key((k) => k + 1); // fresh V2 load
      setV2ModalVisible(true);
    }
  };

  // ─── Step 3: V2 token aaya ────────────────────────────────────────────────
  const handleV2Token = async (event: any) => {
    const token = event.nativeEvent.data;
    setV2ModalVisible(false);

    try {
      await dispatch(
        requestOtp({ mobile: mobileRef.current, v2Token: token }),
      ).unwrap();

      router.push({
        pathname: "/(auth)/verify",
        params: { mobile: `+91${mobileRef.current}` },
      });
    } catch (err: any) {
      // V2 bhi fail → reset, V3 fir se silently chalao
      showError("Verification failed. Retrying...");
      setTimeout(() => {
        setV3Key((k) => k + 1); // fresh V3
        setV3Running(true);
      }, 800);
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

  // V3 — invisible, auto execute
  const getV3Html = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://www.google.com/recaptcha/api.js?render=${SITE_KEY_V3}"></script>
      <script>
        function onLoad() {
          grecaptcha.ready(function() {
            grecaptcha.execute('${SITE_KEY_V3}', { action: 'submit' })
              .then(function(token) {
                window.ReactNativeWebView.postMessage(token);
              })
              .catch(function(err) {
                window.ReactNativeWebView.postMessage('ERROR:' + err);
              });
          });
        }
      </script>
    </head>
    <body onload="onLoad()" style="background:transparent;margin:0;padding:0;"></body>
    </html>
  `;

  // V2 — checkbox captcha
  const getV2Html = () => `
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
          background: transparent;
        }
      </style>
    </head>
    <body>
      <div class="g-recaptcha"
           data-sitekey="${SITE_KEY_V2}"
           data-callback="onVerify">
      </div>
      <script>
        function onVerify(token) {
          window.ReactNativeWebView.postMessage(token);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <LinearGradient colors={theme.bgGradient as any} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Hidden V3 WebView (background mein, user ko nahi dikhta) ── */}
      {v3Running && (
        <View style={styles.hiddenWebView}>
          <WebView
            key={`v3-${v3Key}`}
            source={{ html: getV3Html(), baseUrl: BASE_URL }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={handleV3Token}
            onError={() => {
              setV3Running(false);
              setV2Key((k) => k + 1);
              setV2ModalVisible(true);
            }}
          />
        </View>
      )}

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
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
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

            {/* Checkbox */}
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

            {/* Continue Button */}
            <TouchableOpacity
              disabled={!isValid || loading || v3Running}
              onPress={handleContinuePress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isValid && !loading && !v3Running
                    ? ["#007AFF", "#0040FF"]
                    : ["#2C2C2C", "#1A1A1A"]
                }
                style={styles.continueButton}
              >
                {loading || v3Running ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.continueText}>Continue</Text>
                  </View>
                )}
              </LinearGradient>
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

          {/* ── V2 Checkbox Modal ── */}
          <Modal
            visible={v2ModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setV2ModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.captchaSheet,
                  { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
                ]}
              >
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.textMain }]}>
                    Verification Required
                  </Text>
                  <TouchableOpacity onPress={() => setV2ModalVisible(false)}>
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color={theme.textSub}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.webViewWrapper}>
                  <WebView
                    key={`v2-${v2Key}`}
                    source={{ html: getV2Html(), baseUrl: BASE_URL }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => (
                      <ActivityIndicator
                        size="large"
                        style={{ marginTop: 50 }}
                      />
                    )}
                    onMessage={handleV2Token}
                    style={{ flex: 1 }}
                    mixedContentMode="always"
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
  // Hidden V3 WebView — screen ke bahar, 0 opacity
  hiddenWebView: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    top: -100,
    left: -100,
  },
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
    marginTop: 15,
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
    marginBottom: 10,
  },
  linkText: { textDecorationLine: "underline" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  captchaSheet: {
    width: "100%",
    height: height * 0.6,
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
  modalTitle: { fontSize: 18, fontWeight: "bold" },
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

// import { requestOtp } from "@/redux/slice/authSlice";
// import { AppDispatch } from "@/redux/store";
// import { showError } from "@/utils/toast";
// import { FontAwesome5, Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { router } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   useColorScheme,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { WebView } from "react-native-webview";
// import { useDispatch, useSelector } from "react-redux";
// const SITE_KEY_V3 = process.env.EXPO_PUBLIC_GC_SITE_KEY_v3;
// const SITE_KEY_V2 = process.env.EXPO_PUBLIC_GC_SITE_KEY_v2;

// const { height } = Dimensions.get("window");

// export default function LoginScreen() {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === "dark";

//   const dispatch = useDispatch<AppDispatch>();
//   const loading = useSelector((state: any) => state.auth.loading);
//   const [mobile, setMobile] = useState("");
//   const [agreed, setAgreed] = useState(false);
//   const [captchaVisible, setCaptchaVisible] = useState(false);

//   const handleMobileChange = (text: string) => {
//     const cleaned = text.replace(/[^0-9]/g, "");
//     if (cleaned.length <= 10) setMobile(cleaned);
//   };

//   const isValid = mobile.length === 10 && agreed;

//   const handleContinuePress = () => {
//     if (!isValid) return;
//     setCaptchaVisible(true);
//   };

//   const handleCaptchaMessage = async (event: any) => {
//     const token = event.nativeEvent.data;
//     setCaptchaVisible(false);

//     try {
//       await dispatch(requestOtp({ mobile, v3Token: token })).unwrap();

//       router.push({
//         pathname: "/(auth)/verify",
//         params: { mobile: `+91${mobile}` },
//       });
//     } catch (err: any) {
//       showError("Verification failed. Please try again.");
//     }
//   };
//   const theme = {
//     bgGradient: isDark ? ["#001D4A", "#000814"] : ["#F0F4F8", "#FFFFFF"],
//     cardBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)",
//     cardBorder: isDark
//       ? "rgba(255, 255, 255, 0.12)"
//       : "rgba(255, 255, 255, 0.5)",
//     textMain: isDark ? "#FFFFFF" : "#1A1A1A",
//     textSub: isDark ? "#AAAAAA" : "#666666",
//     inputBg: isDark ? "rgba(255,255,255,0.05)" : "#F8F9FA",
//     inputBorder: isDark ? "#333" : "#CCCCCC",
//   };

//   const getV3Html = (siteKey: string | undefined) => `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
//     <script>
//       function onLoad() {
//         grecaptcha.ready(function() {
//           grecaptcha.execute('${siteKey}', {action: 'submit'})
//           .then(function(token) {
//             window.ReactNativeWebView.postMessage(token);
//           });
//         });
//       }
//     </script>
//   </head>
//   <body onload="onLoad()"></body>
//   </html>
// `;
//   return (
//     <LinearGradient colors={theme.bgGradient as any} style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           bounces={false}
//           showsVerticalScrollIndicator={false}
//         >
//           <SafeAreaView style={styles.topSection}>
//             <View style={styles.logoWrapper}>
//               <Image
//                 source={
//                   isDark
//                     ? require("../../assets/images/appLogo.png")
//                     : require("../../assets/images/logo.webp")
//                 }
//                 style={styles.logoImage}
//                 resizeMode="contain"
//               />
//             </View>
//           </SafeAreaView>

//           <View
//             style={[
//               styles.bottomCard,
//               {
//                 backgroundColor: theme.cardBg,
//                 borderColor: theme.cardBorder,
//               },
//             ]}
//           >
//             <Text style={[styles.loginTitle, { color: theme.textMain }]}>
//               Log In
//             </Text>
//             <Text style={[styles.loginSubtitle, { color: theme.textSub }]}>
//               Welcome back! Please log in to proceed.
//             </Text>

//             {/* Mobile Input */}
//             <View
//               style={[
//                 styles.inputContainer,
//                 {
//                   backgroundColor: theme.inputBg,
//                   borderColor: theme.inputBorder,
//                 },
//               ]}
//             >
//               <Image
//                 source={{ uri: "https://flagcdn.com/w40/in.png" }}
//                 style={styles.flag}
//               />
//               <Text style={[styles.code, { color: theme.textMain }]}>+91</Text>

//               <TextInput
//                 keyboardType="number-pad"
//                 placeholder="Mobile Number"
//                 placeholderTextColor={isDark ? "#555" : "#ADB5BD"}
//                 value={mobile}
//                 onChangeText={handleMobileChange}
//                 style={[styles.input, { color: theme.textMain }]}
//                 maxLength={10}
//                 editable={!loading}
//               />
//             </View>
//             <TouchableOpacity
//               style={styles.checkboxContainer}
//               onPress={() => setAgreed(!agreed)}
//               disabled={loading}
//             >
//               <View
//                 style={[
//                   styles.checkbox,
//                   { borderColor: theme.textSub },
//                   agreed && styles.checkboxChecked,
//                 ]}
//               >
//                 {agreed && (
//                   <Ionicons name="checkmark" size={12} color="white" />
//                 )}
//               </View>
//               <Text style={[styles.checkboxLabel, { color: theme.textSub }]}>
//                 I agree to the terms & privacy Policy
//               </Text>
//             </TouchableOpacity>
//             {/* Continue Button */}
//             <TouchableOpacity
//               disabled={!isValid || loading}
//               onPress={handleContinuePress}
//               activeOpacity={0.8}
//             >
//               <LinearGradient
//                 colors={
//                   isValid && !loading
//                     ? ["#007AFF", "#0040FF"]
//                     : ["#2C2C2C", "#1A1A1A"]
//                 }
//                 style={styles.continueButton}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <View style={styles.buttonContent}>
//                     <Text style={styles.continueText}>Continue</Text>
//                   </View>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>

//             <View style={styles.dividerRow}>
//               <View
//                 style={[styles.line, { backgroundColor: theme.inputBorder }]}
//               />
//               <Text style={[styles.dividerText, { color: theme.textSub }]}>
//                 Or
//               </Text>
//               <View
//                 style={[styles.line, { backgroundColor: theme.inputBorder }]}
//               />
//             </View>

//             {/* Social Buttons */}
//             <TouchableOpacity
//               style={[styles.socialButton, { borderColor: theme.inputBorder }]}
//               disabled={loading}
//             >
//               <FontAwesome5
//                 name="google"
//                 size={18}
//                 color="#EA4335"
//                 style={styles.socialIcon}
//               />
//               <Text
//                 style={[styles.socialButtonText, { color: theme.textMain }]}
//               >
//                 Continue With Google
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.socialButton, { borderColor: theme.inputBorder }]}
//               disabled={loading}
//             >
//               <Ionicons
//                 name="logo-apple"
//                 size={20}
//                 color={isDark ? "white" : "black"}
//                 style={styles.socialIcon}
//               />
//               <Text
//                 style={[styles.socialButtonText, { color: theme.textMain }]}
//               >
//                 Continue With Apple
//               </Text>
//             </TouchableOpacity>

//             <Text style={[styles.footerText, { color: theme.textSub }]}>
//               I am over 18 & also agree to{" "}
//               <Text style={[styles.linkText, { color: theme.textSub }]}>
//                 T&C and Privacy Policy
//               </Text>
//             </Text>
//           </View>

//           {/* CAPTCHA MODAL */}
//           <Modal
//             visible={captchaVisible}
//             animationType="slide"
//             transparent={true}
//             onRequestClose={() => setCaptchaVisible(false)}
//           >
//             {/* Modal Background Overlay */}
//             <View style={styles.modalOverlay}>
//               {/* Modal Content (Bottom Card) */}
//               <View
//                 style={[
//                   styles.captchaSheet,
//                   { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
//                 ]}
//               >
//                 <View style={styles.modalHandle} />

//                 <View style={styles.modalHeader}>
//                   <Text style={[styles.modalTitle, { color: theme.textMain }]}>
//                     Verification Required
//                   </Text>
//                   <TouchableOpacity onPress={() => setCaptchaVisible(false)}>
//                     <Ionicons
//                       name="close-circle"
//                       size={24}
//                       color={theme.textSub}
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.webViewWrapper}>
//                   <WebView
//                     key="v3-captcha"
//                     source={{
//                       html: getV3Html(SITE_KEY_V3),
//                       baseUrl: process.env.EXPO_PUBLIC_S_TO_S_API_BASE,
//                     }}
//                     javaScriptEnabled={true}
//                     domStorageEnabled={true}
//                     startInLoadingState={true}
//                     renderLoading={() => (
//                       <ActivityIndicator
//                         size="large"
//                         style={{ marginTop: 50 }}
//                       />
//                     )}
//                     onMessage={handleCaptchaMessage}
//                     style={{ flex: 1 }}
//                   />
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "space-between" },
//   topSection: {
//     alignItems: "center",
//     paddingTop: height * 0.1,
//     marginBottom: 40,
//   },
//   logoWrapper: { alignItems: "center" },
//   logoImage: { width: 200, height: 100, resizeMode: "contain" },

//   brandText: { fontSize: 32, fontWeight: "bold", marginTop: 5 },
//   bottomCard: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     paddingHorizontal: 25,
//     paddingTop: 20,
//     paddingBottom: 50,
//     borderWidth: 1,
//     borderBottomWidth: 0,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -10 },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//   },
//   loginTitle: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
//   loginSubtitle: {
//     textAlign: "center",
//     marginBottom: 30,
//     marginTop: 5,
//     fontSize: 14,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 30,
//     height: 50,
//     paddingHorizontal: 15,
//     borderWidth: 1,
//     marginBottom: 15,
//   },
//   flag: { width: 24, height: 16, marginRight: 10 },
//   code: { fontSize: 16, fontWeight: "600", marginRight: 10 },
//   input: { flex: 1, fontSize: 16, borderRadius: 30 },
//   continueButton: {
//     borderRadius: 30,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   continueText: { color: "white", fontWeight: "bold", fontSize: 16 },
//   buttonContent: { flexDirection: "row", alignItems: "center" },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 1,
//     marginRight: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   checkboxChecked: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
//   checkboxLabel: { fontSize: 13 },
//   dividerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   line: { flex: 1, height: 1 },
//   dividerText: { paddingHorizontal: 15, fontSize: 12 },
//   socialButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     height: 50,
//     borderRadius: 30,
//     borderWidth: 1,
//     marginBottom: 10,
//   },
//   socialIcon: { marginRight: 15 },
//   socialButtonText: { fontSize: 15, fontWeight: "500" },
//   footerText: {
//     fontSize: 11,
//     textAlign: "center",
//     marginTop: 5,
//     color: "#ffff",
//     marginBottom: 10,
//   },
//   linkText: { textDecorationLine: "underline" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   captchaSheet: {
//     width: "100%",
//     height: height * 0.6,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -5 },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   modalHandle: {
//     width: 40,
//     height: 5,
//     backgroundColor: "#ccc",
//     borderRadius: 2.5,
//     alignSelf: "center",
//     marginBottom: 10,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   webViewWrapper: {
//     height: 450,
//     width: "100%",
//     backgroundColor: "transparent",
//     marginTop: 10,
//     flex: 1,
//     overflow: "hidden",
//     borderRadius: 15,
//   },
// });
