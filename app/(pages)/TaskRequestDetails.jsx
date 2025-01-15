import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  Image,
  Dimensions,
  Platform,
  TextInput,
} from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { updateExistingSubmission } from "../../src/services/submissionService";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { URL } from "../../src/api/apiClient";
import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";
import { updateTask } from "../../src/services/taskService";
import useAuthStore from "../../useAuthStore";

const { width, height } = Dimensions.get("window");

const RequestDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { requestData, source } = route.params || {};
  const [taskData, setTaskData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [requesterName, setRequesterName] = useState("");

  const { user } = useAuthStore();
  console.log("user", user);

  useEffect(() => {
    setTaskData(requestData?.attributes?.task?.data);
    setRequesterName(
      requestData?.attributes?.task?.data?.attributes?.contractor?.data
        ?.attributes?.username
    );
    console.log("task Data", requestData);
  }, [requestData]);

  const documents = requestData?.attributes?.proofOfWork?.data || [];

  const handleDownloadImage = async (imageFormats) => {
    const imageUrl = `${URL}${
      imageFormats?.large?.url ||
      imageFormats?.medium?.url ||
      imageFormats?.small?.url
    }`;
    const filename = imageFormats?.name || "download.png";

    if (Platform.OS === "web") {
      try {
        // Fetch the image first
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Create object URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create an anchor element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;

        // Programmatically click the link
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading on web:", error);
        Alert.alert("Error", "An error occurred while downloading the image.");
      }
    } else {
      // For Android/iOS
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
            console.log(`Download progress: ${progress * 100}%`);
          }
        );

        const { uri } = await downloadResumable.downloadAsync();

        if (Platform.OS === "android") {
          // Save to downloads folder on Android
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
          } else {
            Alert.alert(
              "Permission denied",
              "Unable to save file to Downloads folder"
            );
          }
        } else {
          // For iOS
          Alert.alert("Download Complete", File`saved to: ${uri}`);
        }
      } catch (error) {
        console.error("Error downloading image:", error);
        Alert.alert("Error", "An error occurred while downloading the image.");
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === "rejected" && !declineReason) {
      Alert.alert(
        "Error",
        "Please provide a reason for declining the request."
      );
      return;
    } else if (requesterName === user.username) {
      Alert.alert("Error", "Cannot approve or reject your own submissions");
      return;
    } else {
      try {
        // Update submission status
        const updatedData = {
          data: {
            comment: requestData.attributes.comment,
            proofOfWork: documents.map((doc) => doc.id),
            count: requestData.attributes.count,
            status: newStatus,
            rejection_reason: newStatus === "rejected" ? declineReason : "",
            task: requestData.attributes.task?.data?.id,
          },
        };

        const response = await updateExistingSubmission(
          requestData.id,
          updatedData
        );

        if (response.data) {
          console.log("Submission updated successfully:", response.data);

          // Update task status
          if (newStatus === "approved") {
            const updateTaskData = {
              data: {
                task_status: "completed",
                approver: user.id,
              },
            };

            const taskResp = await updateTask(taskData.id, updateTaskData);

            if (taskResp.data) {
              console.log("Task status updated successfully:", taskResp.data);
              Alert.alert(
                "Success",
                `Request ${newStatus} and task status updated successfully!`
              );
            } else {
              console.error("Failed to update task status:", taskResp);
              Alert.alert(
                "Warning",
                "Request updated, but task status update failed."
              );
            }
          } else {
            console.warn("Task data is missing or invalid.");
            Alert.alert(
              "Warning",
              "Request updated, but task data is missing."
            );
          }

          // Navigate back
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error updating request or task:", error);
        Alert.alert(
          "Error",
          "An error occurred while updating the request or task."
        );
      }
    }
  };

  const handleImagePreview = (imageFormats) => {
    const imageUrl = `${URL}${imageFormats?.small?.url}`;
    console.log("Preview Image URL:", imageUrl);
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const renderDocument = (doc) => (
    <View key={doc.id} style={styles.documentContainer}>
      <View style={styles.documentInfo}>
        <FontAwesome5
          name={doc.attributes.ext === ".png" ? "file-image" : "file-alt"}
          size={24}
          color="#333"
        />
        <View style={styles.documentText}>
          <Text style={styles.documentName}>{doc.attributes.name}</Text>
          <Text style={styles.documentSize}>{`${doc.attributes.size} kb`}</Text>
        </View>
      </View>
      <View style={styles.documentActions}>
        <TouchableOpacity
          onPress={() => handleImagePreview(doc.attributes.formats)}
        >
          <MaterialIcons name="visibility" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDownloadImage(doc.attributes.formats)}
        >
          <Text style={styles.downloadButton}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>
            {source === "notification"
              ? "Notification Details"
              : "Request Details"}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>
            Requester Name: <Text style={styles.textBold}>{requesterName}</Text>
          </Text>
          <Text style={styles.label}>Requester Detail:</Text>
          <Text style={styles.requesterDetail}>
            {requestData?.attributes?.comment ||
              "No additional details provided."}
          </Text>
          <Text style={styles.label}>Documents:</Text>
          <View>{documents.map(renderDocument)}</View>
        </View>
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleStatusChange("rejected")}
          >
            <Text style={styles.buttonText}>Reject Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleStatusChange("approved")}
          >
            <Text style={styles.buttonText}>Approve Request</Text>
          </TouchableOpacity>
        </View> */}

        {/* {requesterName != user.username } */}
        {requestData?.attributes?.status === "pending" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={
                () => setDeclineModalVisible(true)
                // handleStatusChange("rejected")
              }
            >
              <Text style={styles.buttonText}>Reject Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleStatusChange("approved")}
            >
              <Text style={styles.buttonText}>Approve Request</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Decline Reason Modal */}
        <Modal
          visible={declineModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDeclineModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reason for Declining</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reason for Declining"
                value={declineReason}
                onChangeText={setDeclineReason}
                multiline={true}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => setDeclineModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => {
                    handleStatusChange("rejected");
                  }}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    backgroundColor: "#f7f8fc",
  },
  container: {
    padding: width * 0.037,
    paddingTop: height * 0.038,
    backgroundColor: "#FFF",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 20,
    marginTop: -5,
  },
  detailsContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.05,
    fontWeight: "600",
    marginTop: height * 0.015,
    marginBottom: height * 0.01,
    color: "#333",
  },
  textBold: {
    fontWeight: "bold",
    color: "#333",
  },
  requesterDetail: {
    color: "#888",
    lineHeight: height * 0.025,
    fontSize: width * 0.04,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: height * 0.015,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    marginBottom: height * 0.01,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexWrap: "wrap",
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "70%",
  },
  documentText: {
    marginLeft: width * 0.03,
  },
  documentName: {
    fontSize: width * 0.04,
    fontWeight: "500",
    flexShrink: 1,
    color: "#333",
  },
  documentSize: {
    fontSize: width * 0.035,
    color: "#888",
  },
  documentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadButton: {
    color: "#3182CE",
    marginLeft: width * 0.03,
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: height * 0.015,
  },
  rejectButton: {
    backgroundColor: "#FC5275",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#A3D65C",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: width * 0.04,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#000",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: width * 0.04,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    padding: 20,
  },
  modalButtons: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
    padding: 10,
  },
  previewImage: {
    width: "100%",
    height: height * 0.4,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: height * 0.02,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    backgroundColor: "#3182CE",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
});

export default RequestDetails;
