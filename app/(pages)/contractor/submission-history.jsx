import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { useRouter, useLocalSearchParams } from "expo-router";

const SubmissionHistory = () => {
  const router = useRouter();
  const { submissions, taskName, projectName } = useLocalSearchParams();
  const submissionsData = JSON.parse(submissions);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submission History</Text>
      </View>

      <Text style={styles.submissionTitle}>
        Submission for {taskName} for {projectName}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: 10, marginBottom: 30 }}
      >
        {submissionsData.map((submission, index) => (
          <TouchableOpacity
            key={index}
            style={styles.submissionCard}
            onPress={() =>
              router.push({
                pathname: "/contractor/submission-details",
                params: {
                  submission: JSON.stringify(submission),
                  taskName: taskName,
                  projectName: projectName,
                },
              })
            }
          >
            <View style={styles.fileIconContainer}>
              <FontAwesome5 name="file-alt" size={24} color="#666" />
            </View>
            <View style={styles.submissionDetails}>
              <Text style={styles.documentName}>Document_name.png</Text>
              <Text style={styles.submissionDate}>
                Submitted on:{" "}
                {submission?.attributes?.createdAt?.slice(0, 10) || "N/A"}
              </Text>
              <Text style={styles.submissionComment}>
                {submission?.attributes?.comment || "No comments"}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    submission?.attributes?.status === "approved"
                      ? "#4CAF50"
                      : "#FF9800",
                },
              ]}
            >
              <Text style={styles.statusText}>
                {submission?.attributes?.status || "pending"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  submissionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    padding: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  submissionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  submissionDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  submissionDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  submissionComment: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});

export default SubmissionHistory;
