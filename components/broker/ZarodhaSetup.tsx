import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ZerodhaSetup = ({
  onAuthorize,
}: {
  onAuthorize: (url: string) => void;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ clientId: "", apiKey: "", apiSecret: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleFinish = async () => {
    console.log("===========}}}}}}}}}}}}}}}}}");
    console.log(form, "==========form");

    try {
      await AsyncStorage.setItem("kite_credentials", JSON.stringify(form));
      const token = await AsyncStorage.getItem("t");
      if (!token) return;
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_S_TO_S_API_BASE}/broker/kite/login?apiKey=${form.apiKey}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );
      const data = await res.json();
      console.log(data, "==========????????????");

      if (data?.data?.loginUrl) {
        onAuthorize(data.data.loginUrl);
      }
    } catch (error) {
      console.error("Zerodha Setup Error:", error);
    }
  };
  const isNextDisabled = () => {
    if (step === 1) return form.clientId.trim() === "";
    if (step === 2) return form.apiKey.trim() === "";
    if (step === 3) return form.apiSecret.trim() === "";
    return false;
  };
  const renderStepIndicator = () => (
    <View style={styles.stepperContainer}>
      {[1, 2, 3].map((s) => (
        <View
          key={s}
          style={[
            styles.stepDot,
            step >= s ? styles.activeDot : styles.inactiveDot,
            {
              backgroundColor:
                step >= s ? "#3ba5f1" : isDark ? "#2D3748" : "#CBD5E1",
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        Setup Zerodha Kite
      </Text>

      {renderStepIndicator()}

      <View style={styles.formCard}>
        {step === 1 && (
          <View>
            <Text
              style={[styles.label, { color: isDark ? "#A0AEC0" : "#4A5568" }]}
            >
              Client ID
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? "#fff" : "#000",
                  borderColor: isDark ? "#4A5568" : "#E2E8F0",
                },
              ]}
              placeholder="Eg: MST012"
              placeholderTextColor="#718096"
              value={form.clientId}
              onChangeText={(t) => setForm({ ...form, clientId: t })}
              autoCapitalize="characters"
            />
            <Text
              style={styles.hint}
              onPress={() =>
                Linking.openURL("https://kite.zerodha.com/profile")
              }
            >
              Find in Kite Profile →
            </Text>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text
              style={[styles.label, { color: isDark ? "#A0AEC0" : "#4A5568" }]}
            >
              API Key
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? "#fff" : "#000",
                  borderColor: isDark ? "#4A5568" : "#E2E8F0",
                },
              ]}
              placeholder="Your API Key"
              placeholderTextColor="#718096"
              value={form.apiKey}
              onChangeText={(t) => setForm({ ...form, apiKey: t })}
            />
            <Text
              style={styles.hint}
              onPress={() => Linking.openURL("https://developers.kite.trade")}
            >
              Get from Kite Developer Console →
            </Text>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text
              style={[styles.label, { color: isDark ? "#A0AEC0" : "#4A5568" }]}
            >
              API Secret
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDark ? "#fff" : "#000",
                    borderColor: isDark ? "#4A5568" : "#E2E8F0",
                    flex: 1, // Full width lene ke liye
                  },
                ]}
                placeholder="Your API Secret"
                placeholderTextColor="#718096"
                value={form.apiSecret}
                // 🔥 Toggle logic yahan hai
                secureTextEntry={!showPassword}
                onChangeText={(t) => setForm({ ...form, apiSecret: t })}
              />

              {/* 🔥 Eye Button */}
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#718096"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Ensure Redirect URL is set to:
              </Text>
              <Text style={styles.urlText}>dailytradesapp://kite-callback</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={{ color: isDark ? "#A0AEC0" : "#4A5568" }}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          disabled={isNextDisabled()}
          style={[
            styles.nextButton,
            { flex: step === 1 ? 1 : 0.7 },
            isNextDisabled() && {
              backgroundColor: isDark ? "#1A365D" : "#A0C4FF",
              opacity: 0.6,
            },
          ]}
          onPress={() => (step < 3 ? setStep(step + 1) : handleFinish())}
        >
          <Text style={styles.nextButtonText}>
            {step === 3 ? "Finish & Authorize" : "Next Step"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 20 },
  stepperContainer: { flexDirection: "row", marginBottom: 25, gap: 8 },
  stepDot: { height: 6, flex: 1, borderRadius: 3 },
  activeDot: {
    backgroundColor: "#3ba5f1",
    shadowColor: "#3ba5f1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  inactiveDot: {
    backgroundColor: "rgba(124, 124, 124, 0.2)",
  },
  formCard: { minHeight: 120 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 10,
    paddingRight: 45,
    fontSize: 14,
    backgroundColor: "rgba(124, 124, 124, 0.05)",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  hint: { marginTop: 10, color: "#3ba5f1", fontWeight: "600", fontSize: 13 },
  buttonRow: { flexDirection: "row", gap: 15, marginTop: 30 },
  backButton: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(124,124,124,0.2)",
  },
  nextButton: {
    backgroundColor: "#3ba5f1",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  infoBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "rgba(59, 165, 241, 0.1)",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3ba5f1",
  },
  infoText: { fontSize: 12, color: "#718096" },
  urlText: { fontSize: 13, fontWeight: "bold", color: "#3ba5f1", marginTop: 4 },
});

export default ZerodhaSetup;
