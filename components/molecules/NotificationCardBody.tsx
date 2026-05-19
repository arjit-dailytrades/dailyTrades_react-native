import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface NotificationCardBodyProps {
  body: string;
}

const NotificationCardBody: React.FC<NotificationCardBodyProps> = ({
  body,
}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.symbol, { color: theme.textColor }]}
        numberOfLines={1}
      >
        {body}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  symbol: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});

export default NotificationCardBody;
