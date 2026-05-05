import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  user: {
    profile: {
      fName: string;
      lName: string;
      address: string;
      state: string;
      city: string;
      pincode: string;
    };
    mobile: string;
    isMobileVerified: boolean;
    email?: string;
    isEmailVerified?: boolean;
  };
};

const UserDetailCard = ({ user }: Props) => {
  const theme = useAppTheme();
  return (
    <View style={[styles.card, { borderColor: theme.borderColor }]}>
      {/* First + Last Name */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            First Name
          </Text>
          <View
            style={[
              styles.input,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Text style={[styles.value, { color: theme.valColor }]}>
              {user.profile.fName}
            </Text>
          </View>
        </View>

        <View style={styles.half}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            Last Name
          </Text>
          <View
            style={[
              styles.input,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Text style={[styles.value, { color: theme.valColor }]}>
              {user.profile.lName}
            </Text>
          </View>
        </View>
      </View>

      {/* Mobile */}
      <Text style={[styles.label, { color: theme.textColor }]}>Mobile</Text>
      <View
        style={[
          styles.inputWithTag,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <Text style={[styles.value, { color: theme.valColor }]}>
          {user.mobile}
        </Text>
        <Text
          style={[
            styles.tag,
            user.isMobileVerified ? styles.verified : styles.unverified,
          ]}
        >
          {user.isMobileVerified ? "Verified" : "Unverified"}
        </Text>
      </View>

      {/* Email */}
      <Text style={[styles.label, { color: theme.textColor }]}>Email</Text>
      <View
        style={[
          styles.inputWithTag,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <Text style={[styles.value, { color: theme.valColor }]}>
          {user.email || "Enter email"}
        </Text>
        <Text
          style={[
            styles.tag,
            user.isEmailVerified ? styles.verified : styles.unverified,
          ]}
        >
          {user.isEmailVerified ? "Verified" : "Unverified"}
        </Text>
      </View>

      {/* Address */}
      <Text style={[styles.label, { color: theme.textColor }]}>Address</Text>
      <View
        style={[
          styles.input,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <Text style={[styles.value, { color: theme.valColor }]}>
          {user.profile.address}
        </Text>
      </View>

      {/* State */}
      <Text style={[styles.label, { color: theme.textColor }]}>State</Text>
      <View
        style={[
          styles.input,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <Text style={[styles.value, { color: theme.valColor }]}>
          {user.profile.state}
        </Text>
      </View>

      {/* City + Pincode */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={[styles.label, { color: theme.textColor }]}>City</Text>
          <View
            style={[
              styles.input,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Text style={[styles.value, { color: theme.valColor }]}>
              {user.profile.city}
            </Text>
          </View>
        </View>

        <View style={styles.half}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            Pincode
          </Text>
          <View
            style={[
              styles.input,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Text style={[styles.value, { color: theme.valColor }]}>
              {user.profile.pincode}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserDetailCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginTop: 10,
  },

  label: {
    fontSize: 12,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: 600,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  half: {
    flex: 1,
  },

  input: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },

  inputWithTag: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
  },

  value: {
    color: "#fff",
    fontSize: 14,
  },

  tag: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },

  verified: {
    backgroundColor: "#1DB95433",
    color: "#1DB954",
  },

  unverified: {
    backgroundColor: "#FF4D4F33",
    color: "#FF4D4F",
  },
});
