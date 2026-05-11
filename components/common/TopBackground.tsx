import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

const TopBackground = ({ height = 400, style = {}, imageStyle = {} }) => {
  return (
    <View pointerEvents="none" style={[styles.container, { height }, style]}>
      <Image
        source={require("../../assets/images/topBG.png")}
        style={[styles.image, imageStyle]}
        contentFit="cover"
      />
    </View>
  );
};

export default TopBackground;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
