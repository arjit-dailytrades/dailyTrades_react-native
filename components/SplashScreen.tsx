import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Polyline,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ─── Theme ─────────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: "#010D26",
    glowBlue: "rgba(26,122,255,0.22)",
    glowCyan: "rgba(0,180,255,0.14)",
    glowPurple: "rgba(120,80,255,0.12)",
    logoBoxBg: "#111827",
    logoBoxBorder: "rgba(255,255,255,0.09)",
    rippleBorder: "rgba(26,144,255,0.50)",
    tagline: "rgba(255,255,255,0.42)",
    divider: "rgba(255,255,255,0.07)",
    badgeBg: "rgba(255,255,255,0.07)",
    badgeBorder: "rgba(255,255,255,0.13)",
    badgeText: "rgba(255,255,255,0.62)",
    dotActive: "#1a7aff",
    dotInactive: "rgba(255,255,255,0.18)",
    lineStart: "#1a7aff",
    lineEnd: "#00d4ff",
    lineDot: "#00d4ff",
    bubbles: [
      "rgba(26,122,255,0.28)",
      "rgba(0,210,255,0.20)",
      "rgba(120,80,255,0.18)",
      "rgba(26,90,200,0.26)",
      "rgba(0,180,120,0.16)",
    ],
    statusBar: "light-content" as const,
  },
  light: {
    bg: "#EEF3FF",
    glowBlue: "rgba(26,86,219,0.13)",
    glowCyan: "rgba(0,160,220,0.09)",
    glowPurple: "rgba(100,60,240,0.08)",
    logoBoxBg: "#ffffff",
    logoBoxBorder: "rgba(26,86,219,0.14)",
    rippleBorder: "rgba(26,86,219,0.30)",
    tagline: "rgba(15,23,60,0.50)",
    divider: "rgba(15,23,60,0.07)",
    badgeBg: "rgba(15,23,60,0.06)",
    badgeBorder: "rgba(15,23,60,0.13)",
    badgeText: "rgba(15,23,60,0.62)",
    dotActive: "#1a56db",
    dotInactive: "rgba(15,23,60,0.18)",
    lineStart: "#1a56db",
    lineEnd: "#0099cc",
    lineDot: "#0099cc",
    bubbles: [
      "rgba(26,86,219,0.15)",
      "rgba(0,160,220,0.11)",
      "rgba(100,60,240,0.10)",
      "rgba(26,90,200,0.13)",
      "rgba(0,140,100,0.09)",
    ],
    statusBar: "dark-content" as const,
  },
};

// ─── Badges ────────────────────────────────────────────────────────────────────
const BADGES = [
  {
    label: "NSE Live",
    accent: "#00d4a0",
    delay: 1500,
    pos: { top: 96, left: 24 },
  },
  {
    label: "₹ Options",
    accent: "#1a7aff",
    delay: 1700,
    pos: { top: 96, right: 24 },
  },
  {
    label: "Portfolio",
    accent: "#b07aff",
    delay: 1900,
    pos: { bottom: 118, left: 24 },
  },
  {
    label: "Quick Order",
    accent: "#ffb020",
    delay: 2100,
    pos: { bottom: 118, right: 24 },
  },
];

// ─── Bubbles ───────────────────────────────────────────────────────────────────
const BUBBLES = [
  { size: 9, lp: 0.07, d: 0, t: 5400 },
  { size: 6, lp: 0.17, d: 800, t: 4700 },
  { size: 11, lp: 0.29, d: 300, t: 6200 },
  { size: 7, lp: 0.41, d: 1200, t: 5000 },
  { size: 10, lp: 0.54, d: 500, t: 5800 },
  { size: 8, lp: 0.64, d: 1500, t: 5100 },
  { size: 12, lp: 0.74, d: 200, t: 6500 },
  { size: 6, lp: 0.84, d: 1000, t: 4500 },
  { size: 9, lp: 0.91, d: 1700, t: 5600 },
  { size: 7, lp: 0.11, d: 2000, t: 4900 },
  { size: 10, lp: 0.49, d: 2300, t: 6000 },
  { size: 8, lp: 0.69, d: 2600, t: 5300 },
];

// ─── Bubble component ──────────────────────────────────────────────────────────
const Bubble: React.FC<{
  size: number;
  left: number;
  delay: number;
  dur: number;
  color: string;
}> = ({ size, left, delay, dur, color }) => {
  const ty = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const run = () => {
      ty.setValue(0);
      op.setValue(0);
      sc.setValue(1);
      Animated.parallel([
        Animated.sequence([
          Animated.timing(op, {
            toValue: 0.85,
            duration: dur * 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(op, {
            toValue: 0.7,
            duration: dur * 0.8,
            useNativeDriver: true,
          }),
          Animated.timing(op, {
            toValue: 0,
            duration: dur * 0.1,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(ty, {
          toValue: -(height + 40),
          duration: dur,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(sc, {
          toValue: 0.45,
          duration: dur,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => run());
    };
    const timer = setTimeout(run, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        left,
        bottom: -size,
        opacity: op,
        transform: [{ translateY: ty }, { scale: sc }],
      }}
    />
  );
};

// ─── Badge component ───────────────────────────────────────────────────────────
const FloatBadge: React.FC<{
  label: string;
  accent: string;
  delay: number;
  bg: string;
  border: string;
  textColor: string;
  pos: object;
}> = ({ label, accent, delay, bg, border, textColor, pos }) => {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(op, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ty, {
        toValue: 0,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
          position: "absolute",
          ...(pos as object),
        },
        { opacity: op, transform: [{ translateY: ty }] },
      ]}
    >
      <View style={[styles.badgeDot, { backgroundColor: accent }]} />
      <Text style={[styles.badgeLabel, { color: textColor }]}>{label}</Text>
    </Animated.View>
  );
};

// ─── AnimatedSplash ────────────────────────────────────────────────────────────
interface Props {
  onFinish: () => void;
}

const AnimatedSplash: React.FC<Props> = ({ onFinish }) => {
  const scheme = useColorScheme();
  const T = THEMES[scheme === "dark" ? "dark" : "light"];

  // Animated values
  const logoOp = useRef(new Animated.Value(0)).current;
  const logoSc = useRef(new Animated.Value(0.5)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const r1Sc = useRef(new Animated.Value(0.9)).current;
  const r1Op = useRef(new Animated.Value(0.8)).current;
  const r2Sc = useRef(new Animated.Value(0.9)).current;
  const r2Op = useRef(new Animated.Value(0.55)).current;
  const tagOp = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(18)).current;
  const chartOp = useRef(new Animated.Value(0)).current;
  const chartY = useRef(new Animated.Value(14)).current;
  const dotsOp = useRef(new Animated.Value(0)).current;
  const d1Sc = useRef(new Animated.Value(1)).current;
  const d2Sc = useRef(new Animated.Value(1)).current;
  const d3Sc = useRef(new Animated.Value(1)).current;
  const screenOp = useRef(new Animated.Value(1)).current;
  const screenSc = useRef(new Animated.Value(1)).current;

  const rippleLoop = (
    sc: Animated.Value,
    op: Animated.Value,
    initDelay: number,
  ) => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.delay(initDelay),
          Animated.timing(sc, {
            toValue: 2.9,
            duration: 2200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(initDelay),
          Animated.timing(op, {
            toValue: 0,
            duration: 2200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  };

  const dotLoop = (sc: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(sc, {
          toValue: 1.7,
          duration: 360,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sc, {
          toValue: 1,
          duration: 360,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]),
    ).start();
  };

  useEffect(() => {
    StatusBar.setBarStyle(T.statusBar);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(T.bg);
    }

    // Logo spring entrance
    Animated.parallel([
      Animated.spring(logoSc, {
        toValue: 1,
        delay: 200,
        friction: 4.5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(logoOp, {
        toValue: 1,
        duration: 380,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse loop (starts after logo settles)
    const pulseTimer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.06,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, 900);

    // Ripple rings
    rippleLoop(r1Sc, r1Op, 0);
    rippleLoop(r2Sc, r2Op, 900);

    // Tagline
    Animated.parallel([
      Animated.timing(tagOp, {
        toValue: 1,
        duration: 520,
        delay: 700,
        useNativeDriver: true,
      }),
      Animated.timing(tagY, {
        toValue: 0,
        duration: 520,
        delay: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Chart line
    Animated.parallel([
      Animated.timing(chartOp, {
        toValue: 1,
        duration: 600,
        delay: 1100,
        useNativeDriver: true,
      }),
      Animated.timing(chartY, {
        toValue: 0,
        duration: 600,
        delay: 1100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Dot loader
    Animated.timing(dotsOp, {
      toValue: 1,
      duration: 380,
      delay: 1250,
      useNativeDriver: true,
    }).start();
    const dotTimer = setTimeout(() => {
      dotLoop(d1Sc, 0);
      dotLoop(d2Sc, 270);
      dotLoop(d3Sc, 540);
    }, 1700);

    // Fade out + navigate
    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(screenOp, {
          toValue: 0,
          duration: 700,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(screenSc, {
          toValue: 1.06,
          duration: 700,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => onFinish());
    }, 3000);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(dotTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: T.bg },
        { opacity: screenOp, transform: [{ scale: screenSc }] },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={T.statusBar}
      />

      {/* Glow orbs */}
      <View
        style={[
          styles.orb,
          {
            width: 360,
            height: 360,
            backgroundColor: T.glowBlue,
            top: -90,
            left: -120,
          },
        ]}
      />
      <View
        style={[
          styles.orb,
          {
            width: 260,
            height: 260,
            backgroundColor: T.glowCyan,
            bottom: 40,
            right: -70,
          },
        ]}
      />
      <View
        style={[
          styles.orb,
          {
            width: 200,
            height: 200,
            backgroundColor: T.glowPurple,
            top: "38%",
            left: "55%",
          },
        ]}
      />

      {/* Bubbles */}
      {BUBBLES.map((b, i) => (
        <Bubble
          key={i}
          size={b.size}
          left={b.lp * width}
          delay={b.d}
          dur={b.t}
          color={T.bubbles[i % T.bubbles.length]}
        />
      ))}

      {/* Floating badges */}
      {BADGES.map((b, i) => (
        <FloatBadge
          key={i}
          label={b.label}
          accent={b.accent}
          delay={b.delay}
          bg={T.badgeBg}
          border={T.badgeBorder}
          textColor={T.badgeText}
          pos={b.pos}
        />
      ))}

      {/* ── Logo ── */}
      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOp, transform: [{ scale: logoSc }] },
        ]}
      >
        {/* Ripple ring 1 */}
        <Animated.View
          style={[
            styles.ripple,
            { borderColor: T.rippleBorder },
            { opacity: r1Op, transform: [{ scale: r1Sc }] },
          ]}
        />
        {/* Ripple ring 2 */}
        <Animated.View
          style={[
            styles.ripple,
            { borderColor: T.rippleBorder },
            { opacity: r2Op, transform: [{ scale: r2Sc }] },
          ]}
        />
        {/* Logo box */}
        <Animated.View
          style={[
            styles.logoBox,
            {
              backgroundColor: T.logoBoxBg,
              borderColor: T.logoBoxBorder,
            },
            { transform: [{ scale: pulse }] },
          ]}
        >
          <Image
            source={
              scheme === "dark"
                ? require("../assets/images/appLogo.png")
                : require("../assets/images/logo.webp")
            }
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          { color: T.tagline },
          { opacity: tagOp, transform: [{ translateY: tagY }] },
        ]}
      >
        Smart Trading · Real Returns
      </Animated.Text>

      {/* Mini chart line */}
      <Animated.View
        style={[
          styles.chartWrap,
          { opacity: chartOp, transform: [{ translateY: chartY }] },
        ]}
      >
        <Svg width={220} height={62} viewBox="0 0 220 62">
          <Defs>
            <SvgGradient id="lg" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={T.lineStart} stopOpacity="0.28" />
              <Stop offset="100%" stopColor={T.lineEnd} stopOpacity="0.95" />
            </SvgGradient>
          </Defs>
          <Polyline
            points="0,54 36,44 62,47 88,30 118,35 148,16 178,20 220,5"
            fill="none"
            stroke="url(#lg)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={220} cy={5} r={4.5} fill={T.lineDot} />
        </Svg>
      </Animated.View>

      {/* Dot loader */}
      <Animated.View style={[styles.dotsRow, { opacity: dotsOp }]}>
        {[
          { sc: d1Sc, color: T.dotActive },
          { sc: d2Sc, color: T.dotInactive },
          { sc: d3Sc, color: T.dotInactive },
        ].map((d, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: d.color },
              { transform: [{ scale: d.sc }] },
            ]}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedSplash;

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  ripple: {
    position: "absolute",
    width: 156,
    height: 156,
    borderRadius: 38,
    borderWidth: 1.5,
  },
  logoBox: {
    width: 148,
    height: 148,
    borderRadius: 34,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    shadowColor: "#1a7aff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.38,
    shadowRadius: 28,
    elevation: 16,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  tagline: {
    fontSize: 13.5,
    letterSpacing: 0.7,
    marginTop: 6,
  },
  chartWrap: {
    marginTop: 38,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 32,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    borderWidth: 0.5,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeLabel: {
    fontSize: 11.5,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
