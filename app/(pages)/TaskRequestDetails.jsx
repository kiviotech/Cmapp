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
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { updateExistingSubmission } from "../../src/services/submissionService";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";

const { width, height } = Dimensions.get("window");

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
      navigation.goBack();
    } catch (error) {
      console.error("Error updating request:", error);
      Alert.alert(
        "Error",
        "An error occurred while updating the request status."
      );
    }
  };

  const handleImagePreview = (imageFormats) => {
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
          <Text style={styles.documentSize}>{`${doc.attributes.size} kb`}</Text>
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
    backgroundColor: "#f7f8fc",
  },
  container: {
    padding: width * 0.04,
    paddingTop: height * 0.05,
    backgroundColor: "#FFF",
    flexGrow: 1,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "#333",
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