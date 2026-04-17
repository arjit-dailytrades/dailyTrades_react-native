import { Ionicons } from "@expo/vector-icons";
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
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function PageHeader({
  title = "Title",
  showBack = true,
  rightIcon,
  onRightPress,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const navigation = useNavigation();

  const colors = {
    bg: isDark ? "#010D26" : "#ffffff",
    card: isDark ? "#1E293B" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#1E293B",
    border: isDark ? "#334155" : "#E2E8F0",
    glassBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.3)",
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.bg,
          borderBottomColor: colors.glassBorder,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      {/* Left */}
      {showBack ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.iconButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.headerTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* Right */}
      {rightIcon ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.iconButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={onRightPress}
        >
          <Ionicons name={rightIcon} size={20} color={colors.text} />
        </TouchableOpacity>
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
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  iconPlaceholder: {
    width: 42,
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
