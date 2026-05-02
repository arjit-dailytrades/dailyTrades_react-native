import React from "react";
import { StyleSheet, View } from "react-native";
import AvatarAtom from "../atoms/AvtarAtom";
import BadgeAtom from "../atoms/BadgeAtom";
import TextAtom from "../atoms/TextAtom";

const UserInfoMolecule = ({ name, source, status, info, theme }: any) => {
  const statusType =
    status === "SUCCESS"
      ? "success"
      : status === "PENDING"
        ? "pending"
        : "default";

  return (
    <View style={styles.container}>
      <AvatarAtom uri={null} name={name} />

      <View style={styles.middle}>
        <View style={styles.row}>
          <TextAtom style={[styles.name, { color: theme.textColor }]}>
            {name}
          </TextAtom>
          <BadgeAtom label={source} type="free" />
        </View>

        <TextAtom style={[styles.name, { color: theme.textColor }]}>
          {info}
        </TextAtom>
      </View>

      <BadgeAtom label={status} type={statusType} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  middle: {
    flex: 1,
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  subText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
});

export default UserInfoMolecule;
