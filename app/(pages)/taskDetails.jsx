import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { icons } from "../../constants";
import colors from "../../constants/colors";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { fetchStandardTaskById } from "../../src/services/standardTaskService";

const TaskDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskData } = route.params || {};
  const [showModal, setShowModal] = useState(false);
  const [standardTaskDetails, setStandardTaskDetails] = useState([])
  useEffect(() => {
    const fetchStandardTaskDetails = async () => {
      try {
        const standardTaskId = taskData?.attributes?.standard_task?.data?.id
        const response = await fetchStandardTaskById(standardTaskId);
        setStandardTaskDetails(response.data)
      } catch (error) {
        console.error("Error fetching contractor data:", error);
      }
    }
    fetchStandardTaskDetails();
  }, [])

  // Optionally add a check to handle missing taskData gracefully
  if (!taskData) {
    console.error("No task data received"); // Log an error if taskData is undefined
    return <Text>No task data available</Text>; // Render a fallback message if no data
  }

  const documents = taskData?.attributes?.documents?.data
    ? [...taskData?.attributes?.documents?.data]
    : [];

  const openDocument = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Unsupported URL: " + url);
      }
    } catch (error) {
      console.error("Failed to open URL: ", error);
    }
  };

  const openLink = () => {
    const link = taskData?.attributes?.standard_task?.data?.attributes?.Links;

    if (link) {
      Linking.openURL(link).catch((err) =>
        console.error('Failed to open link:', err)
      );
    } else {
      console.warn('No link provided');
    }
  };

  return (
    <View style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <SafeAreaView style={styles.safeAreaView}>
          {/* Header Section */}
          <View style={styles.header}>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                paddingHorizontal: 10,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("(pages)/dashboard")}
              >
                <Image source={icons.backarrow}></Image>
              </TouchableOpacity>
              <Text style={styles.detailsText}>Details</Text>
            </View>

            <View style={styles.deadlineContainer}>
              <Image source={icons.calendar} />
              <Text style={styles.deadlineText}>
                Deadline:{" "}
                {taskData?.attributes?.due_date || "No deadline specified"}
              </Text>
            </View>
          </View>

          {/* Image Placeholder */}
          <View style={styles.imagePlaceholder}>
            {documents.map((document, index) => (
              <Image
                key={document.id || index} // Use a unique key, preferably `document.id`, or fallback to `index`
                source={{ uri: `${MEDIA_BASE_URL}${document?.attributes?.url}` }}
                style={styles.taskImage}
              />
            ))}
          </View>

          {/* Project Info Section */}
          <View style={styles.projectInfo}>
            <View style={styles.projectTitleContainer}>
              <Text style={styles.projectTitle}>
                {taskData.attributes?.standard_task?.data?.attributes?.Name ||
                  "No Task Name"}
              </Text>
              <CustomButton
                buttonStyle={{
                  backgroundColor: "#D5DDF9",
                  fontSize: 8,
                  width: 120,
                  height: 35,
                }}
                textStyle={{
                  color: "#577CFF",
                }}
                text={taskData.stage?.data?.attributes?.name || "No Stage"}
              />
            </View>
            <Text style={styles.projectDescription}>
              {taskData?.attributes?.standard_task?.data?.attributes?.Description ||
                "No description available for this task."}
            </Text>
          </View>
          {console.log('taskdata', taskData)}

          <View>
            <TouchableOpacity style={{ margin: 20 }}
            onPress={openLink}
            >
              <Text style={{fontSize: 18}}>Click here to open link</Text>
            </TouchableOpacity>
          </View>

          {/* Table Section */}
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>
                Consultant / Third Party / Inspector
              </Text>
              <Text style={styles.tableContent}>
                {standardTaskDetails?.attributes?.consultant?.data?.attributes?.name || ""}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>
                Required Drawings / Documents
              </Text>
              <Text style={styles.tableContent}>
                {standardTaskDetails?.attributes?.RequiredDocuments || "No documents"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>QA Team Process</Text>
              <Text style={styles.tableContent}>
                {standardTaskDetails?.attributes?.QATeamProcess || "No QA process"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>QC Team Process</Text>
              <Text style={styles.tableContent}>
                {standardTaskDetails?.attributes?.QCTeamProcess || "No QC process"}
              </Text>
            </View>
            {taskData.rejection_comment && (
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Rejection Comment</Text>
                <Text style={styles.tableContent}>
                  {taskData.rejection_comment}
                </Text>
              </View>
            )}
          </View>

          {/* Attachments Section */}
          <View style={styles.showAttachmentsContainer}>
            {/* <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.showAttachments}
            >
              <Image source={icons.showAttachments} />
              <Text style={styles.showAttachmentsText}>Show attachments</Text>
            </TouchableOpacity> */}

            {taskData?.attributes?.task_status !== "completed" && (
              <TouchableOpacity
                style={[styles.showAttachments, styles.uploadProof]}
                onPress={() =>
                  navigation.navigate("(pages)/uploadProof", {
                    id: taskData.id, // Ensure task ID is passed correctly here
                  })
                }
              >
                <Image source={icons.upload} />
                <Text style={styles.uploadProofText}>
                  Upload your Proof of work
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Modal for showing documents */}
          <Modal visible={showModal} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Documents</Text>

                {/* Display documents as clickable items for download */}
                {documents.map((doc, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openDocument(doc.url)}
                  >
                    <View style={styles.documentItem}>
                      <Text style={styles.documentName}>{doc.fileName}</Text>
                      <Text style={styles.downloadText}>Download</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    padding: 15,
  },
  safeAreaView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  header: {
    marginBottom: 16,
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsText: {
    fontSize: 24,
    paddingLeft: 20,
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  deadlineText: {
    color: colors.radiusColor,
    marginLeft: 8,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: colors.background,
    borderRadius: 10,
    marginBottom: 16,
  },
  taskImage: {
    width: "100%",
    height: "100%",
  },
  projectInfo: {
    marginBottom: 16,
  },
  projectTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  projectTitle: {
    fontSize: 18,
  },
  projectDescription: {
    color: colors.blackColor,
    fontSize: 12,
    paddingTop: 25,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  tableHeader: {
    flex: 2,
    fontWeight: "600",
    color: colors.primary,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: colors.borderColor,
    paddingRight: 10,
  },
  tableContent: {
    flex: 1,
    textAlign: "left",
    color: colors.blackColor,
    fontSize: 14,
    paddingLeft: 10,
  },
  showAttachmentsContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
  },
  showAttachments: {
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 10,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    color: colors.primary,
  },
  uploadProof: {
    backgroundColor: colors.primary,
    marginTop: 15,
  },
  documentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  documentName: {
    fontSize: 14,
    color: colors.blackColor,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  downloadText: {
    color: colors.primary,
    fontSize: 14,
  },
});

export default TaskDetails;
