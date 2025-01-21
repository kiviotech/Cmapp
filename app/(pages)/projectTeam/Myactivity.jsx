import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../../useAuthStore";
import { getProjects } from "../../../src/api/repositories/projectRepository";
import SelectYourProjectCard from "../../../components/SelectYourProjectCard";
import BottomNavigation from "./BottomNavigation";
import { fetchSubcategories } from "../../../src/services/subcategoryService";
import { fetchSubmissions } from "../../../src/services/submissionService";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { fetchProjectTeamIdByUserId } from "../../../src/services/projectTeamService";
import { fetchProjectDetailsByApproverId } from "../../../src/services/projectService";
import apiClient, { MEDIA_BASE_URL } from "../../../src/api/apiClient";
import { icons } from "../../../constants";
import colors from "../../../constants/colors";
import {
  fetchTasks,
  fetchTasksByUserIdAndImage,
} from "../../../src/services/taskService";

const renderCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.title}>{item.title}</Text>
      <MaterialCommunityIcons name="bell-outline" size={20} color="green" />
    </View>
    <Text style={styles.projectName}>{item.projectName}</Text>
    <View style={styles.divider} />
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name="calendar" size={20} color="black" />
      <Text style={styles.infoText}>{item.date}</Text>
    </View>
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name="clock-outline" size={20} color="black" />
      <Text style={styles.infoText}>{item.time}</Text>
    </View>
  </View>
);

const Myactivity = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);
  const { user, designation } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page
  const pageSize = 1; // Number of tasks per page
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const ongoingProjectsCount = projects.filter(
    (item) => item?.attributes?.project_status === "ongoing"
  ).length;

  const completedProjectsCount = projects.filter(
    (item) => item?.attributes?.project_status === "completed"
  ).length;

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          // Fetch tasks with pagination
          const tasksResponse = await fetchTasks(user.id, page, pageSize);
          if (tasksResponse?.data) {
            setTasks(tasksResponse.data.data);
          }

          // Fetch project team data
          const response = await fetchProjectTeamIdByUserId(user.id);
          if (response?.data?.length > 0) {
            setProjects(response.data[0]?.attributes?.projects?.data);
          }

          // Fetch all tasks with specific pagination
          const allTasksResponse = await fetchTasks(user.id, 1, 5);
          setAllTasks(allTasksResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.id, page]);

  useFocusEffect(
    useCallback(() => {
      const fetchRequests = async () => {
        try {
          const response = await fetchSubmissions();
          const submissions = response?.data || [];
          const recentRequests = submissions
            .sort(
              (a, b) =>
                new Date(b.attributes.createdAt) -
                new Date(a.attributes.createdAt)
            )
            .slice(0, 5);

          setRequests(recentRequests);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };
      fetchRequests();
    }, [])
  );

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.userImage}
            source={{
              uri: "https://avatars.githubusercontent.com/u/165383754?v=4",
            }}
          />
        </View>
        <View style={styles.profileDetailSection}>
          <Text style={styles.userName}>{user?.username}</Text>
          <Text style={[styles.userName, { color: colors.primary }]}>
            {designation}
          </Text>
        </View>

        <Text style={styles.sectionHeader}>Select Your Project</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading projects...</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {projects.length > 0 ? (
              projects.map((project) => {
                const endDate = new Date(project?.attributes?.end_date);
                const today = new Date();
                const isDelayed = today > endDate;
                const projectStatus = {
                  text:
                    project?.attributes?.project_status
                      ?.charAt(0)
                      ?.toUpperCase() +
                    project?.attributes?.project_status?.slice(1),
                };

                return (
                  <TouchableOpacity
                    key={project.id}
                    style={[
                      styles.projectCard,
                      {
                        backgroundColor: isDelayed ? "#ffebee" : "#e8f5e9",
                      },
                    ]}
                    onPress={() =>
                      navigation.navigate(
                        "(pages)/projectTeam/ProjectDetails",
                        {
                          projectId: project.id,
                          projectData: project,
                          userId: user.id,
                          tasksData: allTasks,
                        }
                      )
                    }
                  >
                    <View style={styles.projectCardContent}>
                      <Text style={styles.projectTitle}>
                        {project?.attributes?.name || "No Project Name"}
                      </Text>
                      <Text style={styles.projectDescription}>
                        {project?.attributes?.description
                          ? project?.attributes?.description?.length > 50
                            ? `${project?.attributes?.description?.slice(
                                0,
                                50
                              )}...`
                            : project?.attributes?.description
                          : "No description available"}
                      </Text>

                      <View style={styles.statusContainer}>
                        <View
                          style={[
                            styles.projectStatusBadge,
                            {
                              backgroundColor: "#FFFFFF",
                              alignSelf: "flex-start",
                              marginBottom: 8,
                            },
                          ]}
                        >
                          <View style={styles.statusBadgeContent}>
                            <View
                              style={[
                                styles.statusDot,
                                {
                                  backgroundColor: isDelayed
                                    ? "#ff5252"
                                    : "#4caf50",
                                },
                              ]}
                            />
                            <Text style={styles.projectStatusText}>
                              {projectStatus.text || "Unknown"}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.statusIndicator}>
                          <Icon
                            name={isDelayed ? "error" : "check-circle"}
                            size={16}
                            color={isDelayed ? "#ff5252" : "#4caf50"}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              { color: isDelayed ? "#ff5252" : "#4caf50" },
                            ]}
                          >
                            {isDelayed ? "Delayed" : "On Schedule"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.dateContainer}>
                        <Icon name="event" size={16} color="#666" />
                        <Text style={styles.dateText}>
                          End Date:{" "}
                          {project?.attributes?.end_date
                            ? new Date(
                                project?.attributes?.end_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Not set"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.noProjectsContainer}>
                <Text style={styles.noProjectsText}>No projects available</Text>
              </View>
            )}
          </ScrollView>
        )}

        <View style={styles.requestsHeader}>
          <Text style={styles.sectionHeader}>Requests Activity</Text>
        </View>

        {requests.map((request) => (
          <TouchableOpacity
            key={request?.id}
            style={styles.requestItem}
            onPress={() => {
              navigation.navigate("(pages)/TaskRequestDetails", {
                requestData: request,
              });
            }}
          >
            <View>
              <Text style={styles.requestTitle}>
                Submission for{" "}
                {request?.attributes?.task?.data?.attributes?.standard_task
                  ?.data?.attributes?.Name || "task"}{" "}
                in{" "}
                {request?.attributes?.task?.data?.attributes?.project?.data
                  ?.attributes?.name || "Project"}{" "}
              </Text>
              <Text style={styles.requestDescription}>
                {request?.attributes?.comment || "No comments available."}
              </Text>

              <View style={styles.requestStatusContainer}>
                <Text
                  style={[
                    styles.statusBold,
                    request?.attributes?.status === "approved"
                      ? styles.requestStatusApproved
                      : request?.attributes?.status === "rejected"
                      ? styles.requestStatusRejected
                      : request?.attributes?.status === "pending"
                      ? styles.requestStatusPendingText
                      : {},
                  ]}
                >
                  {request?.attributes?.status.charAt(0).toUpperCase() +
                    request?.attributes?.status?.slice(1).toLowerCase()}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("(pages)/TaskRequestDetails", {
                      requestData: request,
                    });
                  }}
                >
                  <Text style={styles.viewLink}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case "completed":
      return styles.completedStatus;
    case "ongoing":
      return styles.ongoingStatus;
    case "ahead":
      return styles.aheadStatus;
    case "delayed":
      return styles.delayedStatus;
    default:
      return styles.pendingStatus;
  }
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    paddingBottom: 100,
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  userImage: {
    width: 115,
    height: 115,
    borderRadius: 100,
  },
  profileDetailSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.blackColor,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 5,
  },
  projectCard: {
    width: 280,
    padding: 16,
    borderRadius: 8,
    marginRight: 15,
    elevation: 2,
  },
  projectCardContent: {
    gap: 8,
  },
  projectCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  projectCardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statusRow: {
    marginTop: 8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  noProjectsContainer: {
    padding: 20,
    alignItems: "center",
  },
  noProjectsText: {
    fontSize: 14,
    color: "#666",
  },
  requestItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  requestDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  requestStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  requestStatusPending: {
    color: "#ff5252",
    fontWeight: "bold",
  },
  viewLink: {
    color: "#1e90ff",
  },
  //  i have done changed here
  requestStatusApproved: {
    color: "#38A169",
  },
  requestStatusRejected: {
    color: "#E53E3E",
  },
  requestStatusPendingText: {
    color: "red",
  },
  statusBold: {
    fontWeight: "bold",
  },
  overviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  overviewItem: {
    alignItems: "center",
    height: 60,
    width: 90,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  overviewNumber1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#577CFF",
  },
  overviewNumber2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FB8951",
  },
  overviewNumber3: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#A3D65C",
  },
  overviewLabel1: {
    fontSize: 12,
    color: "#577CFF",
    top: 8,
    fontWeight: "bold",
  },
  overviewLabel2: {
    fontSize: 12,
    color: "#FB8951",
    top: 8,
    fontWeight: "bold",
  },
  overviewLabel3: {
    fontSize: 12,
    color: "#A3D65C",
    top: 8,
    fontWeight: "bold",
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusContainer: {
    marginVertical: 8,
  },
  projectStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  statusBadgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  projectStatusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});

export default Myactivity;
