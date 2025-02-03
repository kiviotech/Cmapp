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
  Alert,
  ActivityIndicator,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { icons } from "../../constants";
import colors from "../../constants/colors";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MEDIA_BASE_URL, URL } from "../../src/api/apiClient";
import { fetchStandardTaskById } from "../../src/services/standardTaskService";
import { fetchSubmissionById } from "../../src/services/submissionService";
import { fetchTaskById } from "../../src/services/taskService";

const getGoogleDriveFileId = (url) => {
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
};

const getFileTypeFromUrl = (url) => {
  // You can expand this list based on your needs
  const fileTypes = {
    document: ["doc", "docx", "txt", "pdf"],
    spreadsheet: ["xls", "xlsx", "csv"],
    presentation: ["ppt", "pptx"],
    image: ["jpg", "jpeg", "png", "gif"],
  };

  // Default to document type if we can't determine
  return "document";
};

const GoogleDrivePreview = ({ url }) => {
  const fileId = getGoogleDriveFileId(url);
  const fileType = getFileTypeFromUrl(url);

  if (!fileId) {
    return (
      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Invalid Google Drive URL</Text>
      </View>
    );
  }

  return (
    <View style={styles.previewContainer}>
      <View style={styles.previewContent}>
        <Image source={icons.document} style={styles.fileTypeIcon} />
        <Text style={styles.previewTitle}>Google Drive Document</Text>
        {/* Add iframe for preview */}
        <View style={styles.iframeContainer}>
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            style={{
              width: "100%",
              height: 400,
              border: "none",
            }}
            allow="autoplay"
          />
        </View>
      </View>
    </View>
  );
};

const TaskDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskId, refresh } = route.params || {};
  const [taskData, setTaskData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [standardTaskDetails, setStandardTaskDetails] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [taskStatus, setTaskStatus] = useState("");

  // useEffect(() => {
  //   const loadTaskData = async () => {
  //     if (!taskData?.attributes || refresh) {
  //       try {
  //         const response = await fetchTaskById(taskData.id);
  //         if (response?.data) {
  //           setTaskData(response.data);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching task data:", error);
  //       }
  //     }
  //   };

  //   loadTaskData();
  // }, [taskData?.id, refresh]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        if (taskId || refresh) {
          const updatedTaskData = await fetchTaskById(taskId);
          if (updatedTaskData?.data) {
            setTaskData(updatedTaskData.data);
            route.params = {
              ...route.params,
              taskData: updatedTaskData.data,
              refresh: false,
            };
            setTaskStatus(updatedTaskData.data.attributes?.task_status);

            const submissionIds =
              updatedTaskData.data?.attributes?.submissions?.data?.map(
                (item) => item.id
              );

            if (submissionIds && submissionIds.length > 0) {
              const submissionPromises = submissionIds.map((id) =>
                fetchSubmissionById(id)
              );
              const responses = await Promise.all(submissionPromises);
              const submissionData = responses.map((response) => response.data);
              setSubmissions(submissionData.reverse());
            }
          }
        }
      } catch (error) {
        console.error("Error fetching updated task data:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId, refresh]);

  useEffect(() => {
    const fetchStandardTaskDetails = async () => {
      if (taskData.id) {
        try {
          // const submissionData = taskData?.attributes?.submissions?.data;
          const standardTaskId = taskData?.attributes?.standard_task?.data?.id;
          const response = await fetchStandardTaskById(standardTaskId);
          setStandardTaskDetails(response.data);
          // setSubmissions(submissionData);
        } catch (error) {
          console.error("Error fetching contractor data:", error);
        }
      }
    };
    fetchStandardTaskDetails();
  }, [taskData]);

  if (!taskData?.attributes) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
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

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const handleLinkOpen = () => {
    const link = taskData?.attributes?.standard_task?.data?.attributes?.Urls;
    if (link) {
      Linking.openURL(link).catch((err) =>
        console.error("Failed to open link:", err)
      );
    } else {
      Alert.alert(
        "No Link Available",
        "No link has been provided for this task.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.rootContainer}>
      {/* Fixed Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.navigate("(pages)/dashboard")}
          >
            <Image source={icons.backarrow}></Image>
          </TouchableOpacity>
          <Text style={styles.detailsText}>Details</Text>
        </View>

        {/* <View style={styles.deadlineContainer}>
          <Image source={icons.calendar} />
          <Text style={styles.deadlineText}>
            Deadline:{" "}
            {taskData?.attributes?.due_date
              ? new Date(taskData.attributes.due_date)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  .replace(/\//g, "-")
              : "N/A"}
          </Text>
        </View> */}
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={styles.safeAreaView}>
          {/* Image Placeholder */}
          <View style={styles.imagePlaceholder}>
            {documents.map((document, index) => {
              const taskImageUrl = document?.attributes?.url
                ? `${URL}${document.attributes.url}`
                : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

              return (
                <Image
                  key={document.id || index}
                  source={{
                    uri: taskImageUrl,
                  }}
                  style={styles.taskImage}
                />
              );
            })}

            {/* Show default image if no documents */}
            {documents.length === 0 && (
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
                }}
                style={styles.taskImage}
              />
            )}
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
                text={taskData.stage?.data?.attributes?.name || "Substructure"}
              />
            </View>
            <Text style={styles.projectDescription}>
              {taskData?.attributes?.standard_task?.data?.attributes
                ?.Description || "No description available for this task."}
            </Text>
          </View>

          {/* Conditionally render the link button */}
          {/* {taskData?.attributes?.Urls && ( */}
          <View>
            {/* <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>
                Click here to open Documents
              </Text>
            </TouchableOpacity> */}

            {taskData?.attributes?.standard_task?.data?.attributes?.Urls && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleLinkOpen}
              >
                <Text style={styles.linkButtonText}>
                  Click here to open Documents
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* )} */}

          {/* Table Section */}
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>
                Consultant / Third Party / Inspector
              </Text>
              <Text style={styles.tableContent}>
                {standardTaskDetails?.attributes?.consultant?.data?.attributes
                  ?.name || "N/A"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>
                Required Drawings / Documents
              </Text>
              <Text style={styles.tableContent}>
                {standardTaskDetails?.attributes?.RequiredDocuments ||
                  "No documents"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>QA Team Process</Text>
              <Text style={styles.tableContent}>
                {standardTaskDetails?.attributes?.QATeamProcess ||
                  "No QA process"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>QC Team Process</Text>
              <Text style={styles.tableContent}>
                {standardTaskDetails?.attributes?.QCTeamProcess ||
                  "No QC process"}
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
                    id: taskId,
                  })
                }
              >
                <Image source={icons.upload} />
                <Text
                  style={[styles.uploadProofText, { color: colors.whiteColor }]}
                >
                  Upload your Proof of work
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Add this before the Modal section */}
          <View style={styles.approvalSection}>
            <Text style={styles.sectionTitle}>Supervisor's Approval</Text>
            <View
              style={[
                styles.notificationApproval,
                {
                  backgroundColor:
                    submissions[0]?.attributes?.status === "approved"
                      ? "#D4EDDA"
                      : taskData?.attributes?.submissions?.data?.attributes
                          ?.status === "declined"
                      ? "#ffebee"
                      : "rgba(251, 188, 85, 0.3)",
                },
              ]}
            >
              <Image
                source={
                  submissions[0]?.attributes?.status === "approved"
                    ? icons.approved
                    : taskData?.attributes?.submissions?.data?.attributes
                        ?.status === "declined"
                    ? icons.reject
                    : icons.uploadApproval
                }
              />
              <Text
                style={{
                  color:
                    submissions[0]?.attributes?.status === "approved"
                      ? "#28A745"
                      : taskData?.attributes?.submissions?.data?.attributes
                          ?.status === "declined"
                      ? "#DC3545"
                      : "#FBBC55",
                }}
              >
                {submissions[0]?.attributes?.status.charAt(0).toUpperCase() +
                  submissions[0]?.attributes?.status.slice(1) ||
                  "Yet to Approve"}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Previous Submissions</Text>
            {submissions?.length > 0 ? (
              submissions.map((submission, index) => (
                <View key={index} style={styles.submissionItem}>
                  <Text style={styles.submissionStatus}>
                    Status:{" "}
                    <Text
                      style={{
                        color:
                          submission.attributes.status === "pending"
                            ? "#ED8936"
                            : submission.attributes.status === "ongoing"
                            ? "#66B8FC"
                            : submission.attributes.status === "completed" ||
                              submission.attributes.status === "approved"
                            ? "#38A169"
                            : submission.attributes.status === "rejected"
                            ? "#E53E3E"
                            : "#000000",
                      }}
                    >
                      {submission.attributes.status.charAt(0).toUpperCase() +
                        submission.attributes.status.slice(1)}
                    </Text>
                  </Text>
                  <Text style={styles.submissionComment}>
                    Comment: {submission.attributes.comment || "No comment"}
                  </Text>

                  <View style={styles.submissionImages}>
                    {submission.attributes.proofOfWork?.data?.map(
                      (image, imgIndex) => {
                        return (
                          <TouchableOpacity
                            key={imgIndex}
                            onPress={() =>
                              handleImagePress(`${URL}${image.attributes.url}`)
                            }
                          >
                            <Image
                              source={{
                                uri: `${URL}${image.attributes.url}`,
                              }}
                              style={styles.submissionThumbnail}
                            />
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>

                  {submission.attributes.rejectionComment && (
                    <Text style={styles.rejectionText}>
                      Rejection Comment:{" "}
                      {submission.attributes.rejectionComment}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noSubmissionsText}>
                No previous submissions found.
              </Text>
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

          {/* Add Image Preview Modal */}
          <Modal
            visible={imageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setImageModalVisible(false)}
          >
            <View style={styles.imageModalContainer}>
              <TouchableOpacity
                style={styles.closeImageButton}
                onPress={() => setImageModalVisible(false)}
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

          {/* Add Link Preview Modal */}
          <Modal
            visible={linkModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setLinkModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setLinkModalVisible(false)}
                >
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Google Drive Preview</Text>

                <GoogleDrivePreview url={taskData?.attributes?.Urls} />

                <TouchableOpacity
                  style={styles.openLinkButton}
                  onPress={handleLinkOpen}
                >
                  <Text style={styles.openLinkButtonText}>Open in Browser</Text>
                </TouchableOpacity>
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
  header: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.whiteColor,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 10,
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
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 22,
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
  scrollViewContent: {
    paddingBottom: 16,
  },
  safeAreaView: {
    flex: 1,
  },
  approvalSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  notificationApproval: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16,
    height: 50,
    marginTop: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  submissionItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    marginBottom: 10,
  },
  rejectionText: {
    color: "#FC5275",
    marginTop: 5,
  },
  noSubmissionsText: {
    color: colors.textGray,
    fontStyle: "italic",
  },
  submissionImages: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  submissionThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
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
  submissionStatus: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  submissionComment: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 5,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 20,
    textDecorationLine: "underline",
    cursor: "pointer",
  },
  openLinkButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  openLinkButtonText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  linkButtonText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontWeight: "600",
  },
  previewContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  previewContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  fileTypeIcon: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.blackColor,
  },
  previewId: {
    fontSize: 12,
    color: colors.textGray,
    marginBottom: 8,
  },
  iframeContainer: {
    width: "100%",
    height: 400,
    marginTop: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TaskDetails;
