import React from "react";
import { Alert, StyleSheet, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import GlowButton from "../common/GlowButton";
import AgreementCardBody from "../molecules/agreementCardBody";
import AgreementCardHeader from "../molecules/agreementCardHeader";

export default function AgreementCard({ item }: { item: any }) {
  const theme = useAppTheme();
  const openAttachment = async (attachment: string) => {
    Alert.alert("Error", "Could not open the attachment. Please try again.");
    return;
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      {/* Header */}
      <AgreementCardHeader item={item} />

      {/* Info */}
      <AgreementCardBody item={item} />
      <View style={styles.footer}>
        <GlowButton
          title="View Attachment"
          buttonWidth={"100%"}
          handleClick={() => openAttachment(item.attachment)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  footer: {
    marginTop: 10,
  },
});
