import TextAtom from "@/components/atoms/TextAtom";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

interface NoDataProps {
  title?: string;
  subTitle?: string;
}

const NoData = ({
  title = "No results found",
  subTitle = "We can't find any items matching your search.",
}: NoDataProps) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Image
        source={require("../../../assets/images/not_found.png")}
        contentFit="contain"
        style={styles.image}
      />

      <TextAtom style={[styles.title, { color: theme.textColor }]}>
        {title}
      </TextAtom>

      <TextAtom style={[styles.subtitle, { color: theme.subText }]}>
        {subTitle}
      </TextAtom>
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
