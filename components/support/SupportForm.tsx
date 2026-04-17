import { createSupport } from "@/redux/slice/supportSlice";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useDispatch } from "react-redux";

export default function SupportForm({ visible, onClose }: any) {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});

  const colors = {
    bg: isDark ? "#111827" : "#ffffff",
    text: isDark ? "#ffffff" : "#111827",
    input: isDark ? "#1f2937" : "#ffffff",
    border: isDark ? "#374151" : "#e5e7eb",
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const selected = result.assets[0];

    if (selected.size && selected.size > 2 * 1024 * 1024) {
      setErrors((prev: any) => ({
        ...prev,
        file: "File size must be under 2MB",
      }));
      return;
    }

    setErrors((prev: any) => ({ ...prev, file: "" }));
    setFile(selected);
  };

  const removeFile = () => {
    setFile(null);
  };

  const openPdf = async () => {
    if (!file) return;

    try {
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(file.uri);
      } else {
        const contentUri = await FileSystem.getContentUriAsync(file.uri);

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

  const validateForm = () => {
    let newErrors: any = {};

    const titleLength = title.trim().length;
    const commentLength = comment.trim().length;

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (titleLength < 10) {
      newErrors.title = "Title must be at least 10 characters";
    } else if (titleLength > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }

    if (!comment.trim()) {
      newErrors.comment = "Description is required";
    } else if (commentLength < 10) {
      newErrors.comment = "Description must be at least 10 characters";
    } else if (commentLength > 500) {
      newErrors.comment = "Description must not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(
        createSupport({
          title,
          comment,
          file,
        }) as any,
      );

      setTitle("");
      setComment("");
      setFile(null);
      setErrors({});

      onClose();
    } catch (error) {
      setErrors({ api: "Something went wrong" });
    }
  };
  const handleCloseModal = () => {
    setTitle("");
    setComment("");
    setFile(null);
    setErrors({});
    onClose();
  };
  const isImage = file?.mimeType?.startsWith("image");
  const isPdf = file?.mimeType === "application/pdf";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.overlay}>
        {/* Backdrop click */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCloseModal}
        />
        <View style={[styles.modal, { backgroundColor: colors.bg }]}>
          <TouchableOpacity onPress={handleCloseModal} activeOpacity={0.7}>
            <View style={styles.dragBar} />
          </TouchableOpacity>
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.heading,
                { color: colors.text, textAlign: "center" },
              ]}
            >
              Add Support Request
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={[styles.label, { color: colors.text }]}>Title *</Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: errors.title ? "#ef4444" : colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter support title"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors((prev: any) => ({ ...prev, title: "" }));
              }}
            />

            {errors.title && <Text style={styles.error}>{errors.title}</Text>}

            {/* Comment */}
            <Text style={[styles.label, { color: colors.text }]}>
              User Comment *
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textarea,
                {
                  backgroundColor: colors.input,
                  borderColor: errors.comment ? "#ef4444" : colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Description..."
              placeholderTextColor="#9ca3af"
              multiline
              value={comment}
              onChangeText={(text) => {
                setComment(text);
                setErrors((prev: any) => ({ ...prev, comment: "" }));
              }}
            />

            {errors.comment && (
              <Text style={styles.error}>{errors.comment}</Text>
            )}

            {/* Attachment */}
            <Text style={[styles.label, { color: colors.text }]}>
              Attachment (Optional)
            </Text>

            {!file ? (
              <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={30}
                  color="#6b7280"
                />
                <Text style={styles.chooseFile}>Choose File</Text>
                <Text style={styles.fileInfo}>JPG, PNG, PDF (Max 2MB)</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.previewBox}>
                {/* Remove Cross */}
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={removeFile}
                >
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>

                {isImage && (
                  <Image
                    source={{ uri: file.uri }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                  />
                )}

                {isPdf && (
                  <TouchableOpacity style={styles.pdfPreview} onPress={openPdf}>
                    <Ionicons name="document-text" size={60} color="#ef4444" />
                    <Text style={{ marginTop: 6 }}>{file.name}</Text>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                      Tap to view PDF
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {errors.file && <Text style={styles.error}>{errors.file}</Text>}
            {errors.api && <Text style={styles.error}>{errors.api}</Text>}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCloseModal}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={submit}>
              <Text style={{ color: "#fff" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 15,
    maxHeight: "85%",
    width: "100%",

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,

    // Android Shadow
    elevation: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },

  heading: {
    fontSize: 18,
    fontWeight: "600",
  },

  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },

  textarea: {
    height: 90,
    textAlignVertical: "top",
  },

  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
  },

  chooseFile: {
    fontWeight: "600",
    marginTop: 5,
  },

  fileInfo: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 3,
  },

  previewBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    position: "relative",
  },

  removeIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 10,
  },

  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },

  pdfPreview: {
    alignItems: "center",
    paddingVertical: 20,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
  },

  cancelBtn: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },

  submitBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  dragBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
});
