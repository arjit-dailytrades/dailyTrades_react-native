import { useAppTheme } from "@/hooks/use-app-theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GlowButton from "../common/GlowButton";

const Card = ({ val }: { val: any }) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        { borderColor: theme.borderColor, backgroundColor: theme.cardBg },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          <Feather name={val.icon as any} size={20} color={theme.textColor} />
          <View>
            <Text
              style={[
                styles.title,
                {
                  color: theme.textColor,
                },
              ]}
            >
              {val.title}
            </Text>
            <Text
              style={[
                styles.subTitle,
                {
                  color: theme.textColor,
                },
              ]}
            >
              {val.subtitle}
            </Text>
          </View>
        </View>
        <GlowButton title={val.button} />
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
  },
  subTitle: {
    fontSize: 10,
  },
});
