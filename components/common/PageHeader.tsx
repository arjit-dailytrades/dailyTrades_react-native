// import { Feather, Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "expo-router";
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from "react-native";

// type Props = {
//   title?: string;
//   showBack?: boolean;
//   rightIcon?: keyof typeof Feather.glyphMap;
//   onRightPress?: () => void;
// };

// export default function PageHeader({
//   title = "Title",
//   showBack = true,
//   rightIcon,
//   onRightPress,
// }: Props) {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === "dark";
//   const navigation = useNavigation();

//   const colors = {
//     bg: isDark ? "#010D26" : "#ffffff",
//     card: isDark ? "#1E293B" : "#FFFFFF",
//     text: isDark ? "#F1F5F9" : "#1E293B",
//     border: isDark ? "#334155" : "#E2E8F0",
//     glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.3)",
//   };

//   return (
//     <View
//       style={[
//         styles.header,
//         {
//           // backgroundColor: colors.bg,
//           // borderBottomColor: colors.glassBorder,
//           // borderBottomWidth: StyleSheet.hairlineWidth,
//         },
//       ]}
//     >
//       {/* Left */}
//       {showBack ? (
//         <TouchableOpacity
//           activeOpacity={0.7}
//           style={[styles.iconButton, { borderColor: colors.border }]}
//           onPress={() => navigation.canGoBack() && navigation.goBack()}
//         >
//           <Ionicons name="chevron-back" size={22} color={colors.text} />
//         </TouchableOpacity>
//       ) : (
//         <View style={styles.iconPlaceholder} />
//       )}

//       {/* Title */}
//       <View style={styles.titleContainer}>
//         <Text
//           style={[styles.headerTitle, { color: colors.text }]}
//           numberOfLines={1}
//         >
//           {title}
//         </Text>
//       </View>

//       {/* Right */}
//       {rightIcon ? (
//         <TouchableOpacity
//           activeOpacity={0.7}
//           style={[styles.iconButton, { borderColor: colors.border }]}
//           onPress={onRightPress}
//         >
//           <Feather name={rightIcon} size={20} color={colors.text} />
//         </TouchableOpacity>
//       ) : (
//         <View style={styles.iconPlaceholder} />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   iconButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 100,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//   },
//   iconPlaceholder: {
//     width: 42,
//   },
//   titleContainer: {
//     flex: 1,
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//   },
// });

import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

type Props = {
  title?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
};

function Button({
  isDark,
  onPress,
  children,
}: {
  isDark: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.outerRing,
        {
          borderColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)",
          shadowColor: isDark ? "#000" : "#94a3b8",
        },
      ]}
    >
      <BlurView
        intensity={isDark ? 40 : 60}
        tint={isDark ? "dark" : "light"}
        style={styles.blurContainer}
      >
        <View
          style={[
            styles.glassInner,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,255,255,0.55)",
              borderTopColor: isDark
                ? "rgba(255,255,255,0.35)"
                : "rgba(255,255,255,0.9)",
              borderLeftColor: isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.7)",
              borderRightColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.3)",
              borderBottomColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.3)",
            },
          ]}
        >
          {children}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

export default function PageHeader({
  title = "Title",
  showBack = true,
  rightIcon,
  onRightPress,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const navigation = useNavigation();

  const iconColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.85)";
  const titleColor = isDark ? "#F1F5F9" : "#1E293B";

  return (
    <View style={styles.header}>
      {/* Left — Back Button */}
      {showBack ? (
        <Button
          isDark={isDark}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={iconColor} />
        </Button>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.headerTitle, { color: titleColor }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* Right Icon Button */}
      {rightIcon ? (
        <Button isDark={isDark} onPress={onRightPress}>
          <Feather name={rightIcon} size={20} color={iconColor} />
        </Button>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  outerRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  glassInner: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  iconPlaceholder: {
    width: 44,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
});
