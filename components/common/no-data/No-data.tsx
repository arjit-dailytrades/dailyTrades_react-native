import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

interface NoDataProps {
  title?: string;
  msg?: string;
}

const { width } = Dimensions.get("window");

const NoData = ({
  title = "No Data",
  msg = "Reload to get data!",
}: NoDataProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Theme based styles
  const theme = {
    text: isDark ? "#F8FAF8" : "#1A2138",
    subText: isDark ? "#9CA3AF" : "#666666",
    bg: isDark ? "transparent" : "#FFFFFF",
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Image
        source={require("../../../assets/images/foundscript.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.subText }]}>{msg}</Text>
        <Text style={{ color: theme.subText }}>No records found.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});

export default NoData;
