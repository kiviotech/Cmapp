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
import {
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { updateExistingSubmission } from "../../src/services/submissionService";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { URL } from "../../src/api/apiClient";
import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";
import { updateTask } from "../../src/services/taskService";
import useAuthStore from "../../useAuthStore";
import ImageEditor from "../../components/FileUploading/ImageEditor";
import apiClient from "../../src/api/apiClient";

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
  const [editingImage, setEditingImage] = useState(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [documents, setDocuments] = useState([]);

  const { user } = useAuthStore();
console.log('userdata', requestData)
  useEffect(() => {
    setTaskData(requestData?.attributes?.task?.data);
    setRequesterName(requestData?.attributes?.submitted_by?.data?.attributes?.username);
    setDocuments(requestData?.attributes?.proofOfWork?.data || []);
  }, [requestData]);

  const handleDownloadImage = async (imageFormats) => {
    const imageUrl = `${URL}${imageFormats?.thumbnail?.url}`;
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
          // Close the decline modal if rejecting
          if (newStatus === "rejected") {
            setDeclineModalVisible(false);
            setDeclineReason(""); // Reset the decline reason
          }

          // Update task status for approved requests
          if (newStatus === "approved") {
            const updateTaskData = {
              data: {
                task_status: "completed",
              },
            };

            const taskResp = await updateTask(taskData.id, updateTaskData);

            if (taskResp.data) {
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
            Alert.alert("Success", `Request ${newStatus} successfully!`);
          }

          // Simply navigate back instead of going to notifications
          navigation.goBack();

          // Call the onStatusUpdate callback if it exists
          if (route.params?.onStatusUpdate) {
            await route.params.onStatusUpdate(newStatus);
          }
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
    const imageUrl = `${URL}${imageFormats?.thumbnail?.url}`;
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleEditImage = (imageFormats) => {
    // Ensure imageFormats is defined before proceeding
    if (!imageFormats || !imageFormats.thumbnail?.url) {
      console.error("Invalid image format data.");
      Alert.alert("Error", "Invalid image format data.");
      return;
    }

    const imageUrl = `${URL}${imageFormats.thumbnail.url}`;
    setEditingImage({
      id: imageFormats.id,
      url: imageUrl,
      formats: imageFormats,
    });
    setShowImageEditor(true);
  };

  const handleSaveEditedImage = async (editedImageBlob) => {
    try {
      // Convert blob URL to actual blob
      const response = await fetch(editedImageBlob);
      const blob = await response.blob();

      // Generate a unique filename with timestamp
      const timestamp = new Date().getTime();
      const filename = `edited_${timestamp}.jpg`;

      // Create FormData
      const formData = new FormData();
      formData.append(
        "files",
        new File([blob], filename, { type: "image/jpeg" })
      );

      // Upload the edited image
      const uploadResponse = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.status === 200) {
        const newImageId = uploadResponse.data[0].id;

        // Update the submission with the new image ID
        const updatedData = {
          data: {
            ...requestData.attributes,
            proofOfWork: [newImageId], // Replace with new image ID
            status: requestData.attributes.status,
            task: requestData.attributes.task?.data?.id,
          },
        };

        const submissionResponse = await updateExistingSubmission(
          requestData.id,
          updatedData
        );

        if (submissionResponse.data) {
          // Immediately update local state with new image data
          const newDocument = {
            id: uploadResponse.data[0].id,
            attributes: {
              ...uploadResponse.data[0],
              formats: {
                thumbnail: {
                  url: uploadResponse.data[0].url,
                },
              },
            },
          };

          setDocuments([newDocument]);
          setShowImageEditor(false);
          setEditingImage(null);
          Alert.alert("Success", "Image updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error updating image:", error);
      Alert.alert("Error", "Failed to update image. Please try again.");
    }
  };

  const renderDocument = (doc) => {
    // Ensure doc and doc.attributes are defined before accessing
    if (!doc || !doc.attributes) {
      return null; // Return nothing if document is invalid
    }

    const { name, ext, size, formats } = doc.attributes;

    return (
      <View key={doc.id} style={styles.documentContainer}>
        <View style={styles.documentInfo}>
          <FontAwesome5
            name={ext?.includes(".png") ? "file-image" : "file-alt"}
            size={24}
            color="#333"
          />
          <View style={styles.documentText}>
            <Text style={styles.documentName}>
              {name || "Unnamed document"}
            </Text>
            <Text style={styles.documentSize}>
              {`${(size / 1024).toFixed(2)} kb`}
            </Text>
          </View>
        </View>
        <View style={styles.documentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleImagePreview(formats)}
          >
            <MaterialIcons name="visibility" size={20} color="#577CFF" />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditImage(formats)}
          >
            <MaterialIcons name="edit" size={20} color="#577CFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleDownloadImage(formats)}
          >
            <MaterialIcons name="download" size={20} color="#FFF" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      {showImageEditor ? (
        <ImageEditor
          imageUri={editingImage?.url}
          onSave={handleSaveEditedImage}
          onCancel={() => setShowImageEditor(false)}
        />
      ) : (
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
              Requester Name:{" "}
              <Text style={styles.textBold}>{requesterName}</Text>
            </Text>
            <Text style={styles.label}>Requester Detail:</Text>
            <Text style={styles.requesterDetail}>
              {requestData?.attributes?.comment ||
                "No additional details provided."}
            </Text>
            <Text style={styles.label}>Documents:</Text>
            <View>{documents.map(renderDocument)}</View>
          </View>

          {/* Show approval status for approved requests */}
          {requestData?.attributes?.status === "approved" && (
            <View style={styles.statusContainer}>
              <View style={styles.approvedStatus}>
                <AntDesign name="checkcircle" size={24} color="#A3D65C" />
                <Text style={styles.approvedStatusText}>
                  This request has been approved
                </Text>
              </View>
            </View>
          )}

          {requestData?.attributes?.status === "rejected" && (
            <View style={styles.statusContainer}>
              <View style={styles.rejectedStatus}>
                <AntDesign name="closecircle" size={24} color="#FC5275" />
                <Text style={styles.rejectedStatusText}>
                  This request has been rejected
                </Text>
              </View>
              {requestData?.attributes?.rejection_reason && (
                <View style={styles.rejectionReasonContainer}>
                  <Text style={styles.rejectionReasonLabel}>Reason:</Text>
                  <Text style={styles.rejectionReasonText}>
                    {requestData.attributes.rejection_reason}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Show action buttons only for pending requests */}
          {requestData?.attributes?.status === "pending" && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => setDeclineModalVisible(true)}
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
        </ScrollView>
      )}

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
            <AntDesign name="close" size={24} color="white" />
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
    backgroundColor: "#F8F8F8",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  documentText: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 14,
    color: "#6B7280",
  },
  documentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#577CFF",
    fontWeight: "500",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#577CFF",
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
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
  statusContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  approvedStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F9EB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A3D65C",
  },
  approvedStatusText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#2C5282",
    fontWeight: "600",
  },
  rejectedStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FC5275",
  },
  rejectedStatusText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#C53030",
    fontWeight: "600",
  },
  rejectionReasonContainer: {
    marginTop: 12,
    backgroundColor: "#FFF5F5",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FC5275",
  },
  rejectionReasonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#C53030",
    marginBottom: 4,
  },
  rejectionReasonText: {
    fontSize: 14,
    color: "#C53030",
  },
});

export default RequestDetails;
