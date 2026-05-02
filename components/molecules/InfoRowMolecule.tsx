import React from "react";
import { StyleSheet, View } from "react-native";
import TextAtom from "../atoms/TextAtom";

const InfoRowMolecule = ({ label, value, theme }: any) => {
  return (
    <View style={styles.row}>
      <TextAtom style={{ color: theme.subText }}>{label}</TextAtom>
      <TextAtom style={{ color: theme.textColor }}>{value}</TextAtom>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
  },
  value: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default InfoRowMolecule;
