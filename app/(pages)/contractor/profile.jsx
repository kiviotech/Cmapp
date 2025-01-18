import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigation from "./BottomNavigation ";
import colors from "../../../constants/colors";
import useAuthStore from "../../../useAuthStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import SelectYourProject from "./SelectYourProject";
import { fetchTasks } from "../../../src/services/taskService";

const profile = () => {
  const { user, designation } = useAuthStore();
  const router = useRouter();
  const navigation = useNavigation();

  const [projectsDetail, setProjectsDetail] = useState([]); // to store all user project
  const [tasks, setTasks] = useState([]); // to store tasks per project
  // const [contractorsDetails, setContractorsDetails] = useState([])
  const [uploadedHistory, setUploadedHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [contractorsData, setContractorsData] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadContractorData = async () => {
      if (user && user.id) {
        try {
          setIsLoading(true); // Start loading  
          const data = await fetchTasks(user.id);
          const projectsData = data.data
            .map((taskData) => taskData?.attributes?.project?.data) // Map to project data
            .filter(
              (project, index, self) =>
                project && // Ensure project is not null or undefined
                self.findIndex((p) => p?.id === project.id) === index // Ensure unique projects
            );
          const tasksWithSubmissions = data.data.filter(
            (task) => task.attributes.submissions.data.length > 0
          );
          setTasks(data.data); // Set tasks
          setProjects(projectsData)
          setUploadedHistory(tasksWithSubmissions);
        } catch (error) {
          console.error('Error fetching contractor data:', error);
        } finally {
          setIsLoading(false); // End loading
        }
      }
    };

    loadContractorData();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: 10, marginBottom: 30 }}
      >
        <View>
          <View style={styles.profileImageContiner}>
            <Image
              style={styles.userImage}
              source={{
                uri: "https://avatars.githubusercontent.com/u/165383754?v=4",
              }}
            ></Image>
          </View>
          <View style={styles.profileDetailSection}>
            <Text style={styles.userName}>
              {user?.username ? user?.username : "Guest"}
            </Text>
            <Text style={[styles.userName, { color: colors.primary }]}>
              {designation ? designation : ""}
            </Text>
          </View>
        </View>

        {uploadedHistory?.map((history, historyIndex) => {
          // Get only the first submission from the submissions array
          const firstSubmission = history?.attributes?.submissions?.data?.[0];
          const totalSubmissions =
            history?.attributes?.submissions?.data?.length || 0;

          return (
            <View key={historyIndex} style={styles.submissionSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Submission for{" "}
                  {history?.attributes?.standard_task?.data?.attributes?.Name ||
                    "N/A"}{" "}
                  for{" "}
                  {history?.attributes?.project?.data?.attributes?.name ||
                    "N/A"}
                </Text>
                {totalSubmissions > 1 && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/contractor/submission-history",
                        params: {
                          submissions: JSON.stringify(
                            history?.attributes?.submissions?.data
                          ),
                          taskName:
                            history?.attributes?.standard_task?.data?.attributes
                              ?.Name,
                          projectName:
                            history?.attributes?.project?.data?.attributes
                              ?.name,
                        },
                      })
                    }
                  >
                    <Text style={styles.viewAllLink}>
                      View all ({totalSubmissions})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {firstSubmission && (
                <TouchableOpacity
                  style={styles.submissionContainer}
                  onPress={() => {
                    router.push({
                      pathname: "/contractor/submission-details",
                      params: {
                        submission: JSON.stringify(firstSubmission),
                        taskName:
                          history?.attributes?.standard_task?.data?.attributes
                            ?.Name,
                        projectName:
                          history?.attributes?.project?.data?.attributes?.name,
                        allSubmissions: JSON.stringify(
                          history?.attributes?.submissions?.data
                        ),
                      },
                    });
                  }}
                >
                  <View style={styles.submissionItem}>
                    <View style={styles.fileIconContainer}>
                      <FontAwesome5 name="file-alt" size={24} color="#666" />
                    </View>
                    <View style={styles.submissionDetails}>
                      <Text style={styles.documentName}>Document_name.png</Text>
                      <Text style={styles.submissionDate}>
                        Submitted on:{" "}
                        {firstSubmission?.attributes?.createdAt?.slice(0, 10) ||
                          "N/A"}
                      </Text>
                      <Text style={styles.submissionComment}>
                        {firstSubmission?.attributes?.comment || "No comments"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            firstSubmission?.attributes?.status === "approved"
                              ? "#4CAF50"
                              : "#FF9800",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {firstSubmission?.attributes?.status || "pending"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <View style={{ marginTop: 20 }}>
          <SelectYourProject
            isLoading={isLoading}
            projects={projects}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          {projectsDetail?.map((project) => (
            <View key={project.id}>
              {project.attributes.tasks?.data.map((task, index) => (
                <View key={index} style={styles.submissionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Project Task Data:", task);
                      navigation.navigate("(pages)/taskDetails", {
                        taskData: task,
                        refresh: false,
                      });
                    }}
                  >
                    <Text style={styles.submissionTitle}>
                      {task.attributes.Name || `Task ${index + 1}`} for{" "}
                      {project.attributes.name}
                    </Text>

                    <View style={styles.documentRow}>
                      <View style={styles.documentInfo}>
                        <View style={styles.iconContainer}>
                          <FontAwesome5
                            name="file-alt"
                            size={24}
                            color="#666"
                          />
                        </View>
                        <View style={styles.documentDetails}>
                          <Text style={styles.documentName}>
                            Document_name.png
                          </Text>
                          <Text style={styles.submissionDate}>
                            Submitted on:{" "}
                            {task.attributes.createdAt?.slice(0, 10)}
                          </Text>
                          <Text style={styles.documentDescription}>
                            Lorem ipsum dolor sit amet consectetur. Augue et non
                            amet vestibulum
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              task.attributes.task_status === "completed"
                                ? "#4CAF50"
                                : "#FF9800",
                          },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {task.attributes.task_status === "completed"
                            ? "Approved"
                            : "Pending"}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.viewAllButton}>
                      <Text style={styles.viewAllText}>View all</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.background,
    paddingBottom: 45,
  },
  profileImageContiner: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  userImage: {
    width: 115,
    height: 115,
    borderRadius: 57.5,
    borderRadius: 57.5,
    objectFit: "cover",
  },
  profileDetailSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  userName: {
    color: colors.blackColor,
    // fontFamily: fonts.WorkSans600,
    fontSize: 26,
    letterSpacing: 0.13,
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 18,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    // fontFamily: fonts.WorkSans500,
    color: colors.blackColor,
  },
  projectTasksContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  projectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.blackColor,
  },

  taskCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },

  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.blackColor,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  taskDetails: {
    gap: 8,
  },

  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  taskInfoText: {
    color: "#666",
    fontSize: 14,
  },

  submissionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  viewAllLink: {
    color: "#007AFF",
    fontSize: 14,
  },
  submissionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
    marginLeft: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  documentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  documentInfo: {
    flexDirection: "row",
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  documentDetails: {
    flex: 1,
  },

  documentDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },

  viewAllButton: {
    alignSelf: "flex-end",
    padding: 8,
  },

  viewAllText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },

  submissionSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  viewAllLink: {
    color: "#007AFF",
    fontSize: 14,
  },
  submissionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    paddingLeft: 10,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 5,
  },
  projectCard: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
  },
  projectCardContent: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  projectStatus: {
    fontSize: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  projectStatusText: {
    marginLeft: 5,
    fontSize: 14,
  },
  projectEndDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginTop: 5,
  },
  endDateIcon: {
    marginRight: 4,
  },
  projectEndDate: {
    fontSize: 14,
    color: "#666",
  },
  noProjectsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});
