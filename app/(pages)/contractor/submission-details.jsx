import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchTasksBySubmissionId } from "../../../src/services/taskService";
import { fetchSubmissionById } from "../../../src/services/submissionService";
import { URL } from "../../../src/api/apiClient";

const SubmissionDetail = () => {
  const router = useRouter();
  const { submission, taskName, projectName } = useLocalSearchParams();
  const submissionData = JSON.parse(submission);

  const [taskData, setTaskData] = React.useState(null);
  const [proofImages, setProofImages] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imageModalVisible, setImageModalVisible] = React.useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await fetchTasksBySubmissionId(submissionData.id);
        setTaskData(response.data[0]);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (submissionData?.id) {
      fetchTaskData();
    }
  }, [submissionData?.id]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetchSubmissionById(submissionData.id);
        // Handle multiple images
        const imageUrls =
          response?.data?.attributes?.proofOfWork?.data?.map(
            (image) => `${URL}${image.attributes.url}`
          ) || [];
        setProofImages(imageUrls);
      } catch (error) {
        console.error("Error fetching submission:", error);
      }
    };

    if (submissionData?.id) {
      fetchSubmission();
    }
  }, [submissionData?.id]);

  const handleViewProof = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submission Detail</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.taskTitle}>
            {taskData?.attributes?.standard_task?.data?.attributes?.Name ||
              taskName}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  submissionData?.attributes?.status === "approved"
                    ? "#4CAF50"
                    : "#FF9800",
              },
            ]}
          >
            <Text style={styles.statusText}>
              {submissionData?.attributes?.status || "pending"}
            </Text>
          </View>
        </View>
        <Text style={styles.projectName}>
          {taskData?.attributes?.project?.data?.attributes?.name || projectName}
        </Text>

        <Text style={styles.description}>
          {taskData?.attributes?.standard_task?.data?.attributes?.Description ||
            "Regular site walkthroughs to ensure compliance with safety regulations and quality standards."}
        </Text>

        <View style={styles.section}>
          <View style={[styles.row, styles.headerRow]}>
            <Text
              style={[
                styles.columnTitle,
                styles.leftTitle,
                styles.normalWeight,
              ]}
            >
              Consultant / Third Party / Inspector
            </Text>
            <Text
              style={[
                styles.columnTitle,
                styles.rightTitle,
                styles.normalWeight,
                styles.alignWithLeft,
              ]}
            >
              Surveyor
            </Text>
          </View>

          <View style={styles.contentRows}>
            <View style={styles.row}>
              <Text style={styles.leftCell}>Required Drawings / Documents</Text>
              <Text style={[styles.rightCell, styles.alignWithLeft]}>
                {taskData?.attributes?.standard_task?.data?.attributes
                  ?.RequiredDocuments || "Electrical layout plans"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.leftCell}>QA Team Process</Text>
              <Text style={[styles.rightCell, styles.alignWithLeft]}>
                {taskData?.attributes?.standard_task?.data?.attributes
                  ?.QATeamProcess ||
                  "Coordinate and supervise wiring installation"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.leftCell}>QC Team Process</Text>
              <Text style={[styles.rightCell, styles.alignWithLeft]}>
                {taskData?.attributes?.standard_task?.data?.attributes
                  ?.QCTeamProcess ||
                  "Inspect wiring installation for proper routing and connection"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.proofSection}>
          <Text style={styles.sectionTitle}>
            Proof of work ({proofImages.length}):
          </Text>
          {proofImages.map((imageUrl, index) => (
            <View key={index} style={styles.documentRow}>
              <FontAwesome5 name="file-image" size={20} color="#666" />
              <Text style={styles.documentName}>
                Proof of work image {index + 1}
              </Text>
              <TouchableOpacity onPress={() => handleViewProof(imageUrl)}>
                <Text style={styles.viewButton}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
          {proofImages.length === 0 && (
            <View style={styles.documentRow}>
              <FontAwesome5 name="file-pdf" size={20} color="#666" />
              <Text style={styles.documentName}>No images available</Text>
            </View>
          )}
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments:</Text>
          <Text style={styles.commentText}>
            {submissionData?.attributes?.comment || "No comments provided"}
          </Text>
        </View>
      </ScrollView>

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
            <FontAwesome5 name="times" size={24} color="white" />
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
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: "#333",
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  projectName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 24,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerRow: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    padding: 12,
  },
  columnTitle: {
    fontSize: 14,
    flex: 1,
  },
  leftTitle: {
    color: "#4B73FF",
  },
  rightTitle: {
    color: "#333",
  },
  leftCell: {
    flex: 1,
    padding: 12,
    color: "#4B73FF",
  },
  rightCell: {
    flex: 1,
    padding: 12,
    color: "#333",
  },
  contentRows: {
    backgroundColor: "#fff",
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: 12,
  },
  text: {
    color: "#666",
    fontSize: 14,
    marginBottom: 12,
  },
  proofSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  documentName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
  },
  viewButton: {
    color: colors.primary,
    fontSize: 14,
  },
  commentsSection: {
    marginBottom: 24,
  },
  commentText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  statusSection: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  normalWeight: {
    fontWeight: "400",
  },
  rightAlign: {
    textAlign: "right",
    paddingRight: 12,
  },
  alignWithLeft: {
    paddingLeft: 12,
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

export default SubmissionDetail;
