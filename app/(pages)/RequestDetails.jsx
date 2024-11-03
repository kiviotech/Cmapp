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
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { updateExistingSubmission } from "../../src/services/submissionService";
import { MEDIA_BASE_URL } from "../../src/api/apiClient"; // Import MEDIA_BASE_URL

const RequestDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { requestData } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("Request Details:", requestData);
  }, [requestData]);

  const documents = requestData?.attributes?.proofOfWork?.data || [];

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedData = {
        data: {
          comment: requestData.attributes.comment,
          proofOfWork: documents.map((doc) => doc.id),
          count: requestData.attributes.count,
          status: newStatus,
          task: requestData.attributes.task?.data?.id,
        },
      };
      const response = await updateExistingSubmission(
        requestData.id,
        updatedData
      );
      Alert.alert("Success", `Request ${newStatus} successfully!`);
      navigation.goBack(); // Navigate back after updating
    } catch (error) {
      console.error("Error updating request:", error);
      Alert.alert(
        "Error",
        "An error occurred while updating the request status."
      );
    }
  };

  const handleImagePreview = (imageFormats) => {
    // Construct the full URL using MEDIA_BASE_URL and the large image path
    const imageUrl = `${MEDIA_BASE_URL}${
      imageFormats?.large?.url || imageFormats?.url
    }`;
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
          <Text style={styles.documentSize}>{`${doc.attributes.size} mb`}</Text>
        </View>
      </View>
      <View style={styles.documentActions}>
        <TouchableOpacity
          onPress={() => handleImagePreview(doc.attributes.formats)}
        >
          <MaterialIcons name="visibility" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Download initiated")}>
          <Text style={styles.downloadButton}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Request detail</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>
            Requester Name: <Text style={styles.textBold}>ABC</Text>
          </Text>
          <Text style={styles.label}>Requester Detail:</Text>
          <Text style={styles.requesterDetail}>
            {requestData?.attributes?.comment ||
              "No additional details provided."}
          </Text>
          <Text style={styles.label}>Documents:</Text>
          <View>{documents.map(renderDocument)}</View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleStatusChange("declined")}
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

        {/* Image Preview Modal */}
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
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  container: {
    padding: 16,
    backgroundColor: "#FFF",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 19,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  textBold: {
    fontWeight: "bold",
  },
  requesterDetail: {
    color: "#888",
    lineHeight: 20,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentText: {
    marginLeft: 10,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
  },
  documentSize: {
    fontSize: 12,
    color: "#888",
  },
  documentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadButton: {
    color: "#3182CE",
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  rejectButton: {
    backgroundColor: "#FC5275",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#A3D65C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
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
    padding: 16,
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#3182CE",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RequestDetails;
