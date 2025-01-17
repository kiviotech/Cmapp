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
} from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import useAuthStore from "../../useAuthStore";
import { updateExistingRegistration } from "../../src/services/registrationService";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { URL } from "../../src/api/apiClient";
import { createNewUser } from "../../src/services/userService";
import {
  fetchUserGroupsWithContractorRole,
  fetchUserGroupById,
  updateUserGroupById,
} from "../../src/services/userGroupService";
import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";
import { createNewContractor } from "../../src/services/contractorService";

const { width, height } = Dimensions.get("window");

const RequestDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { requestData } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [contractorGroupIds, setContractorGroupIds] = useState([]);
  const user = useAuthStore();

  useEffect(() => {
    console.log("Request Details:", requestData);

    const fetchContractorGroups = async () => {
      try {
        const response = await fetchUserGroupsWithContractorRole();
        const ids = response?.data?.map((item) => item.id) || [];
        console.log("Contractor Group IDs:", ids);
        setContractorGroupIds(ids);
      } catch (error) {
        console.error("Error fetching contractor groups:", error);
      }
    };

    fetchContractorGroups();
  }, [requestData]);

  const documents = requestData?.attributes?.documents?.data || [];

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
          Alert.alert("Download Complete", `File saved to: ${uri}`);
        }
      } catch (error) {
        console.error("Error downloading image:", error);
        Alert.alert("Error", "An error occurred while downloading the image.");
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedData = {
        data: {
          status: newStatus,
          approver: user.user.id,
          documents: documents.map((doc) => doc.id),
        },
      };
      const response = await updateExistingRegistration(
        requestData?.id,
        updatedData
      );

      if (response.data) {
        Alert.alert("Success", `Request ${newStatus} successfully!`);

        if (newStatus === "approved") {
          await handleCreateUser();
        }

        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating request:", error);
      Alert.alert(
        "Error",
        "An error occurred while updating the request status."
      );
    }
  };

  const handleCreateUser = async () => {
    try {
      const userData = {
        username: requestData.attributes.username,
        email: requestData.attributes.email,
        password: requestData.attributes.password,
      };

      const response = await createNewUser(userData);
      if (response) {
        const newUserId = response.user.id;
        console.log("User created successfully with ID:", newUserId);
        Alert.alert("Success", "User account created successfully.");

        if (contractorGroupIds.length > 0) {
          await updateContractorGroup(newUserId);
        }

        await createContractorRecord(newUserId);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Alert.alert("Error", "An error occurred while creating the user.");
    }
  };

  const updateContractorGroup = async (newUserId) => {
    try {
      const contractorGroupId = contractorGroupIds[0];

      const currentGroup = await fetchUserGroupById(contractorGroupId);
      const existingUserIds =
        currentGroup?.data?.attributes?.users?.data?.map((user) => user.id) ||
        [];

      const updatedUserIds = [...new Set([...existingUserIds, newUserId])];

      const updatedGroupData = {
        data: {
          users: updatedUserIds,
        },
      };
      const response = await updateUserGroupById(
        contractorGroupId,
        updatedGroupData
      );
      if (response) {
        console.log("User added to contractor group:", response);
      }
    } catch (error) {
      console.error("Error updating contractor group:", error);
    }
  };

  const createContractorRecord = async (newUserId) => {
    try {
      const contractorData = {
        data: {
          username: requestData.attributes.username,
          socialSecurityNumber: requestData.attributes.socialSecurityNumber,
          email: requestData.attributes.email,
          documents: documents.map((doc) => doc.id),
          user: newUserId,
          sub_contractor:
            requestData.attributes.sub_contractor?.data?.id || null,
          projects: [], // Populate with project IDs if available
          tasks: [], // Populate with task IDs if available
        },
      };

      const response = await createNewContractor(contractorData);
      if (response) {
        console.log("Contractor record created successfully:", response);
        Alert.alert("Success", "Contractor record created successfully.");
      }
    } catch (error) {
      console.error("Error creating contractor record:", error);
      Alert.alert(
        "Error",
        "An error occurred while creating the contractor record."
      );
    }
  };

  const handleImagePreview = (imageFormats) => {
    const imageUrl = `${URL}${
      imageFormats?.large?.url ||
      imageFormats?.medium?.url ||
      imageFormats?.small?.url
    }`;
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const renderDocument = (docs) => (
    <View key={`doc-${docs.id}`} style={styles.documentContainer}>
      <View style={styles.documentInfo}>
        <FontAwesome5
          name={docs.attributes.ext === ".png" ? "file-image" : "file-alt"}
          size={24}
          color="#333"
        />
        <View style={styles.documentText}>
          <Text style={styles.documentName}>{docs.attributes.name}</Text>
          <Text style={styles.documentSize}>
            {`${docs.attributes.size} kb`}
          </Text>
        </View>
      </View>
      <View style={styles.documentActions}>
        <TouchableOpacity
          onPress={() => handleImagePreview(docs.attributes.formats)}
        >
          <MaterialIcons name="visibility" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDownloadImage(docs.attributes.formats)}
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
          <Text style={styles.headerText}>Request Details</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>
            Requester Name:{" "}
            <Text style={styles.textBold}>
              {requestData?.attributes?.username}
            </Text>
          </Text>
          <Text style={styles.label}>
            Social Security Number:{" "}
            <Text style={styles.textBold}>
              {requestData?.attributes?.socialSecurityNumber}
            </Text>
          </Text>
          <Text style={styles.label}>
            Status:{" "}
            <Text style={styles.textBold}>
              {requestData?.attributes?.status}
            </Text>
          </Text>
          <Text style={styles.label}>Documents:</Text>
          <View>
            {documents.map((doc, index) => (
              <View key={`document-${doc.id}-${index}`}>
                {renderDocument(doc)}
              </View>
            ))}
          </View>
        </View>

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
          </View>
        )}

        {requestData?.attributes?.status === "pending" && (
          <View style={styles.buttonContainer}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    width: "100%",
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
  },
  textBold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: height * 0.02,
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
    maxWidth: "70%", // Restricts width to avoid overflow
  },
  documentText: {
    marginLeft: width * 0.03,
  },
  documentName: {
    fontSize: width * 0.04,
    fontWeight: "500",
    flexShrink: 1, // Allows text to shrink if too long
  },
  documentSize: {
    fontSize: width * 0.03,
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
  rejectButton: {
    backgroundColor: "#FC5275",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#A3D65C",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: width * 0.04,
  },

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
    fontSize: width * 0.04,
    fontWeight: "600",
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
});

export default RequestDetails;
