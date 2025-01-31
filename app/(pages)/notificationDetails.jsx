import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchSubmissionById } from "../../src/services/submissionService";
import { URL } from "../../src/api/apiClient";
import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";

const NotificationDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { notification, task, formattedTime, statusColor } = params;
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const notificationData =
          typeof notification === "string"
            ? JSON.parse(notification)
            : notification;

        console.log("Notification Data:", notificationData);
        const response = await fetchSubmissionById(notificationData.id);
        console.log("Submission Details Response:", response);
        setSubmissionDetails(response);
      } catch (error) {
        console.error("Error fetching submission details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissionDetails();
  }, [notification]);

  // Parse the JSON strings back to objects if needed
  const notificationData =
    typeof notification === "string" ? JSON.parse(notification) : notification;
  const taskData = typeof task === "string" ? JSON.parse(task) : task;

  const handleImagePreview = (doc) => {
    const imageUrl = `${URL}${doc.attributes.url}`;
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleDownloadImage = async (doc) => {
    const imageUrl = `${URL}${doc.attributes.url}`;
    const filename = doc.attributes.name || "download.png";

    if (Platform.OS === "web") {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading on web:", error);
        Alert.alert("Error", "An error occurred while downloading the image.");
      }
    } else {
      try {
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        const downloadResumable = FileSystem.createDownloadResumable(
          imageUrl,
          fileUri,
          {},
          (downloadProgress) => {
            const progress =
              downloadProgress.totalBytesWritten /
              downloadProgress.totalBytesExpectedToWrite;
          }
        );

        const { uri } = await downloadResumable.downloadAsync();

        if (Platform.OS === "android") {
          const permissions =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

          if (permissions.granted) {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              filename,
              "image/png"
            ).then(async (createdUri) => {
              await FileSystem.writeAsStringAsync(createdUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
              });
              Alert.alert(
                "Success",
                "File downloaded successfully to Downloads folder!"
              );
            });
          }
        } else {
          Alert.alert("Download Complete", `File saved to: ${uri}`);
        }
      } catch (error) {
        console.error("Error downloading image:", error);
        Alert.alert("Error", "An error occurred while downloading the image.");
      }
    }
  };

  const renderDocument = (doc, index) => {
    return (
      <View key={index} style={styles.documentItem}>
        <View style={styles.documentHeader}>
          <View style={styles.documentInfo}>
            <MaterialIcons name="insert-drive-file" size={24} color="#666" />
            <View style={styles.documentDetails}>
              <Text style={styles.documentName}>
                {doc.attributes.name || "Document"}
              </Text>
              <Text style={styles.documentSize}>
                {(doc.attributes.size / 1024).toFixed(2)} kb
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.documentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleImagePreview(doc)}
          >
            <MaterialIcons name="visibility" size={16} color="#577CFF" />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleDownloadImage(doc)}
          >
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={{ width: 80 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Details</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectName}>
              Project: {taskData?.attributes?.project?.data?.attributes?.name}
            </Text>
            <Text style={[styles.status, { color: statusColor }]}>
              {notificationData.attributes.status?.charAt(0).toUpperCase() +
                notificationData.attributes.status?.slice(1) || "Pending"}
            </Text>
          </View>
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>{formattedTime}</Text>
          </View>

          <Text style={styles.sectionTitle}>
            Comment:{" "}
            <Text style={styles.comment}>
              {notificationData.attributes.comment ||
                "No additional information"}
            </Text>
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Documents</Text>
        {submissionDetails?.data?.attributes?.proofOfWork?.data?.map(
          renderDocument
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.closeImageButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  projectName: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  timestampContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 1,
  },
  comment: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  submissionDetails: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  detailItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  documentUrl: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 8,
    textDecorationLine: "underline",
  },
  documentItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentDetails: {
    marginLeft: 12,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  documentSize: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  documentActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    color: "#577CFF",
    fontSize: 13,
    fontWeight: "500",
  },
  downloadButton: {
    backgroundColor: "#577CFF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  closeImageButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
});

export default NotificationDetails;
