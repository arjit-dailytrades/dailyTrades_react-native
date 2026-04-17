import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import {
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";

export default function SupportDetailModal({ visible, onClose, data }: any) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  if (!data) return null;

  const colors = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    card: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f1f5f9" : "#1e293b",
    subtext: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
    accent: "#3b82f6",
    statusBg: data.status === "SUBMITTED" ? "#fef3c7" : "#dcfce7",
    statusText: data.status === "SUBMITTED" ? "#b45309" : "#15803d",
  };

  const formattedDate = new Date(data.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const openPdf = async () => {
    if (!data?.attachment) return;

    try {
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(data?.attachment);
      } else {
        const contentUri = await FileSystem.getContentUriAsync(
          data?.attachment,
        );

        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: "application/pdf",
        });
      }
    } catch (error) {
      console.log("PDF open error", error);
    }
  };
  const url = data?.attachment || "";

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isPdf = /\.pdf$/i.test(url);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.modal, { backgroundColor: colors.bg }]}>
          <View style={styles.dragBar} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Area */}
            <View style={styles.header}>
              <View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: colors.statusBg },
                  ]}
                >
                  <Text
                    style={[styles.statusText, { color: colors.statusText }]}
                  >
                    {data.status}
                  </Text>
                </View>
              </View>
              {/* <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: colors.border }]}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity> */}
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>
              {data.title}
            </Text>
            <Text style={[styles.date, { color: colors.subtext }]}>
              Submitted on {formattedDate}
            </Text>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            {/* Comment Section */}
            <Text style={[styles.sectionLabel, { color: colors.subtext }]}>
              USER COMMENT
            </Text>
            <View
              style={[
                styles.commentBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.commentText, { color: colors.text }]}>
                {data.userComment}
              </Text>
            </View>

            {/* Attachment Section */}
            {data?.attachment && (
              <>
                <View style={styles.attachmentHeader}>
                  <Text
                    style={[styles.sectionLabel, { color: colors.subtext }]}
                  >
                    ATTACHMENT
                  </Text>
                </View>
                <View
                  style={[styles.imageWrapper, { borderColor: colors.border }]}
                >
                  {isImage && (
                    <Image
                      source={{ uri: data?.attachment }}
                      style={styles.imagePreview}
                      resizeMode="contain"
                    />
                  )}

                  {isPdf && (
                    <TouchableOpacity
                      style={styles.pdfPreview}
                      onPress={openPdf}
                    >
                      <Ionicons
                        name="document-text"
                        size={60}
                        color="#ef4444"
                      />
                      <Text style={{ fontSize: 12, color: "#6b7280" }}>
                        Tap to view PDF
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(0,0,0,0.6)",
  },
  modal: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 10,
    maxHeight: "85%",
    width: "100%",
  },
  dragBar: {
    width: 45,
    height: 5,
    backgroundColor: "#cbd5e1",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  scrollContent: { paddingBottom: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  statusText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  ticketId: { fontSize: 12, fontWeight: "500" },
  closeBtn: { padding: 6, borderRadius: 20 },
  title: { fontSize: 22, fontWeight: "700", lineHeight: 30 },
  date: { fontSize: 13, marginTop: 4 },
  divider: { height: 1, marginVertical: 20 },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 25,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
  },
  commentBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 25,
  },
  commentText: { fontSize: 15, lineHeight: 22 },
  attachmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  imageWrapper: {
    height: 200,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "100%", height: "100%" },
  doneBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },

  pdfPreview: {
    alignItems: "center",
    paddingVertical: 20,
  },
});
