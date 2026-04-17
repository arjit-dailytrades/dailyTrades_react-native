import { RootState } from "@/redux/store";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSelector } from "react-redux";
import CommonButton from "./common/CommonButton";
import GlowButton from "./common/GlowButton";
import SubscriptionPlan from "./paymentOption/payment";

interface Props {
  visible: boolean;
  trade: any;
  advisor: any;
  onClose: () => void;
  handleSelectPlan: (id: string | null) => void;
  selectedPlan: string | null;
}

const darkTheme = {
  bg: "#010D26",
  inputBg: "#0D1F45",
  inputBorder: "#1C2E54",
  inputText: "#FFFFFF",
  placeholder: "#8899BB",
  label: "#FFFFFF",
  heading: "#FFFFFF",
  subHeading: "#FFFFFFCC",
  progressTrack: "#1C2E54",
  progressFill: "#2563EB",
  accent: "#2563EB",
  termsBg: "#FFFFFF",
  termsTitle: "#111111",
  termsBody: "#333333",
  checkLabel: "#CBD5E1",
  checkLink: "#FFFFFF",
  checkboxBorder: "#8899BB",
  checkboxCheckedBg: "#2563EB",
  checkboxCheckedBorder: "#2563EB",
  checkmark: "#FFFFFF",
  closeBtn: "rgba(255,255,255,0.15)",
  closeText: "#FFFFFF",
  sendOtpBg: "#2563EB",
  sendOtpText: "#FFFFFF",
  btnText: "#FFFFFF",
  step2HeadingColor: "#FFFFFF",
};

const lightTheme = {
  bg: "#ffffff",
  inputBg: "#FFFFFF",
  inputBorder: "#C7D5EE",
  inputText: "#0A1A3A",
  placeholder: "#7A94C1",
  label: "#0A1A3A",
  heading: "#0A1A3A",
  subHeading: "#0A1A3ACC",
  progressTrack: "#C7D5EE",
  progressFill: "#2563EB",
  accent: "#2563EB",
  termsBg: "#FFFFFF",
  termsTitle: "#111111",
  termsBody: "#333333",
  checkLabel: "#374151",
  checkLink: "#2563EB",
  checkboxBorder: "#7A94C1",
  checkboxCheckedBg: "#2563EB",
  checkboxCheckedBorder: "#2563EB",
  checkmark: "#FFFFFF",
  closeBtn: "rgba(0,0,0,0.1)",
  closeText: "#0A1A3A",
  sendOtpBg: "#2563EB",
  sendOtpText: "#FFFFFF",
  btnText: "#FFFFFF",
  step2HeadingColor: "#0A1A3A",
};

export default function UnlockTradeModal({
  visible,
  trade,
  advisor,
  onClose,
  handleSelectPlan,
  selectedPlan,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const t = isDark ? darkTheme : lightTheme;

  const [step, setStep] = useState(1);
  const [progress] = useState(new Animated.Value(0.33));
  const { canOpenScript, canOpenLoading } = useSelector(
    (state: RootState) => state.script,
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    pan: "",
    aadhaar: "",
    otp: "",
    agreement: false,
    plan: "",
  });

  const animateProgress = (to: number) => {
    Animated.timing(progress, {
      toValue: to,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const nextStep = () => {
    if (step === 1) {
      setStep(2);
      animateProgress(0.66);
    } else if (step === 2 && form.agreement) {
      setStep(3);
      animateProgress(1);
    }
  };

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["33%", "100%"],
  });

  const FieldLabel = ({ label }: { label: string }) => (
    <Text style={[styles.fieldLabel, { color: t.label }]}>{label}</Text>
  );

  const StyledInput = ({
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    autoCapitalize = "sentences",
    extraStyle = {},
  }: any) => (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={t.placeholder}
      style={[
        styles.input,
        {
          backgroundColor: t.inputBg,
          borderColor: t.inputBorder,
          color: t.inputText,
        },
        extraStyle,
      ]}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.root, { backgroundColor: t.bg }]}>
        {/* Dark mode: glowing image backgrounds */}
        {isDark && (
          <>
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
          </>
        )}

        {/* Light mode: subtle blue top accent */}

        {step === 1 && (
          <View style={styles.fullScreen}>
            <Text style={[styles.heading, { color: t.heading }]}>
              Complete your kyc &{"\n"}subscribe in 3 quick steps!
            </Text>
            <Text style={[styles.subHeading, { color: t.subHeading }]}>
              Step 1: Your Details
            </Text>

            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FieldLabel label="Name" />
              <StyledInput
                placeholder="Full Name"
                value={form.name}
                onChangeText={(v: string) => setForm({ ...form, name: v })}
              />

              <FieldLabel label="Email" />
              <View style={styles.emailRow}>
                <StyledInput
                  placeholder="Email Address"
                  value={form.email}
                  onChangeText={(v: string) => setForm({ ...form, email: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  extraStyle={{
                    flex: 1,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderRightWidth: 0,
                  }}
                />
                <TouchableOpacity
                  style={[styles.sendOtpBtn, { backgroundColor: t.sendOtpBg }]}
                >
                  <Text style={[styles.sendOtpText, { color: t.sendOtpText }]}>
                    Send OTP
                  </Text>
                </TouchableOpacity>
              </View>

              <FieldLabel label="PAN" />
              <StyledInput
                placeholder="PAN Number"
                value={form.pan}
                onChangeText={(v: string) => setForm({ ...form, pan: v })}
                autoCapitalize="characters"
              />

              <FieldLabel label="Aadhaar Card" />
              <StyledInput
                placeholder="Aadhaar Number"
                value={form.aadhaar}
                onChangeText={(v: string) => setForm({ ...form, aadhaar: v })}
                keyboardType="numeric"
              />

              <FieldLabel label="OTP" />
              <StyledInput
                placeholder="Enter OTP"
                value={form.otp}
                onChangeText={(v: string) => setForm({ ...form, otp: v })}
                keyboardType="numeric"
              />
            </ScrollView>

            <GlowButton
              title="Verify"
              handleClick={nextStep}
              buttonWidth={"100%"}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.fullScreen}>
            <Text style={[styles.step2Heading, { color: t.step2HeadingColor }]}>
              Step 2: Accept Agreement
            </Text>

            <View style={[styles.termsWrapper, { backgroundColor: t.termsBg }]}>
              <ScrollView
                style={styles.termsScroll}
                showsVerticalScrollIndicator={false}
              >
                <Text style={[styles.termsTitle, { color: t.termsTitle }]}>
                  Terme a cooditions
                </Text>
                <Text style={[styles.termsBody, { color: t.termsBody }]}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum. Sed ut perspiciatis unde omnis
                  iste natus error sit voluptatem accusantium doloremque
                  laudantium, totam rem aperiam, eaque ipsa quae ab illo
                  inventore veritatis et quasi architecto beatae vitae dicta
                  sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                  aspernatur aut odit aut fugit, sed quia consequuntur magni
                  dolores eos qui ratione voluptatem sequi nesciunt.
                </Text>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.checkRow}
              activeOpacity={0.8}
              onPress={() => setForm({ ...form, agreement: !form.agreement })}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: t.checkboxBorder },
                  form.agreement && {
                    backgroundColor: t.checkboxCheckedBg,
                    borderColor: t.checkboxCheckedBorder,
                  },
                ]}
              >
                {form.agreement && (
                  <Text style={[styles.checkmark, { color: t.checkmark }]}>
                    ✓
                  </Text>
                )}
              </View>
              <Text style={[styles.checkLabel, { color: t.checkLabel }]}>
                I have read and agree to{" "}
                <Text style={[styles.checkLink, { color: t.checkLink }]}>
                  Terms and Conditions
                </Text>
                {"\n"}and{" "}
                <Text style={[styles.checkLink, { color: t.checkLink }]}>
                  {">"}Privacy Policy.
                </Text>
              </Text>
            </TouchableOpacity>

            <GlowButton
              title="Continue"
              handleClick={nextStep}
              disabled={!form.agreement}
              buttonWidth={"100%"}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.fullScreen}>
            <Text style={[styles.step2Heading, { color: t.step2HeadingColor }]}>
              Step 3: Select Plan
            </Text>
            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={false}
            >
              <SubscriptionPlan
                advisor={advisor}
                handleSelectPlan={handleSelectPlan}
                selectedPlan={selectedPlan}
              />
            </ScrollView>
          </View>
        )}
        <View style={{ paddingBottom: 36, paddingHorizontal: 20 }}>
          <CommonButton title="Close" handleClick={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  topBgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 0,
  },
  vectorImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 1,
    opacity: 0.6,
  },

  fullScreen: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 2,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 14,
  },
  step2Heading: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },

  progressTrack: {
    height: 3,
    borderRadius: 3,
    marginBottom: 28,
  },
  progressFill: {
    height: 3,
    borderRadius: 3,
  },

  formScroll: {
    flex: 1,
  },
  formContent: {
    paddingBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 14,
    borderWidth: 1,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sendOtpBtn: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sendOtpText: {
    fontSize: 12,
    fontWeight: "600",
  },

  termsWrapper: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  termsScroll: {
    flex: 1,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  termsBody: {
    fontSize: 12,
    lineHeight: 20,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 3,
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
  checkLabel: {
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
  },
  checkLink: {
    fontWeight: "600",
  },
});
