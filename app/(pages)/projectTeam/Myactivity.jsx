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
  const [isSearchVisible, setSearchVisible] = useState(false);
  const navigation = useNavigation();
  const [projectsDetail, setProjectsDetail] = useState([]);
  const [tasksDetail, setTasksDetail] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [jobProfile, setJobProfile] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [projectTeamId, setProjectTeamId] = useState(null);
  const [projectDetails, setProjectDetails] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const { user, designation, role, projects, permissions } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const ongoingProjectsCount = projectDetails.filter(
    (item) => item.attributes.project_status === "ongoing"
  ).length;

  const completedProjectsCount = projectDetails.filter(
    (item) => item.attributes.project_status === "completed"
  ).length;

  useEffect(() => {
    const fetchProjectTeamId = async () => {
      if (user && user.id) {
        try {
          const response = await fetchProjectTeamIdByUserId(user.id);
          const [{ id }] = response.data;
          setProjectTeamId(id);
        } catch (error) {
          console.error("Error fetching project team ID:", error);
        }
      }
    };
    fetchProjectTeamId();
  }, [user]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (projectTeamId) {
        try {
          const projectResponse = await fetchProjectDetailsByApproverId(
            projectTeamId
          );
          const projects = projectResponse.data;

          const projectsWithTasks = await Promise.all(
            projects.map(async (project) => {
              const tasks = project.attributes.tasks.data;
              const taskDetails = await Promise.all(
                tasks.map(async (task) => {
                  const taskResponse = await apiClient.get(
                    `/tasks/${task.id}?populate=*`
                  );

                  return { id: task.id, ...taskResponse.data };
                })
              );
              return { ...project, taskDetails };
            })
          );

          setProjectDetails(projectsWithTasks);
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };

    fetchProjectDetails();
  }, [projectTeamId]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (projectTeamId) {
        try {
          const response = await fetchProjectDetailsByApproverId(projectTeamId);
          setProjectDetails(response.data); // Store project details with tasks
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };
    fetchProjectDetails();
  }, [projectTeamId]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const allTaskDetails = [];

      for (const project of projectDetails) {
        const tasks = project.attributes.tasks.data;
        for (const task of tasks) {
          try {
            const taskResponse = await apiClient.get(
              `https://cmappapi.kivio.in/api/tasks/${task.id}?populate=*`
            );
            allTaskDetails.push(taskResponse.data);
          } catch (error) {
            console.error(
              `Error fetching details for task ID ${task.id}:`,
              error
            );
          }
        }
      }

      setTaskDetails(allTaskDetails);
    };

    if (projectDetails.length > 0) {
      fetchTaskDetails();
    }
  }, [projectDetails]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userResponse = await getAuthenticatedUserWithPopulate(
  //         "job_profile"
  //       );
  //       setJobProfile(userResponse.data.job_profile.name);
  //     } catch (error) {
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectData = await getProjects();
        if (isMounted && projectData?.data?.data) {
          const uniqueProjects = Array.from(
            new Map(
              projectData.data.data.map((item) => [item.id, item])
            ).values()
          );
          setProjectsDetail(uniqueProjects);
          if (uniqueProjects.length > 0) {
            setSelectedProjectId(uniqueProjects[0]?.id);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (isMounted) {
          setProjectsDetail([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchRequests = async () => {
  //       try {
  //         const response = await fetchSubmissions();
  //         const submissions = response?.data || [];
  //         const recentRequests = submissions
  //           .sort(
  //             (a, b) =>
  //               new Date(b.attributes.createdAt) -
  //               new Date(a.attributes.createdAt)
  //           )
  //           .slice(0, 5);

  //         setRequests(recentRequests);
  //       } catch (error) {
  //         console.error("Error fetching submissions:", error);
  //       }
  //     };

  //     fetchRequests();
  //   }, [])
  // );

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
      <ScrollView style={styles.container}>
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

        <Text style={styles.sectionHeader}>Your Project</Text>
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
            {projectDetails.length > 0 ? (
              projectDetails.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.projectCard,
                    (() => {
                      const endDate = new Date(project.attributes.end_date);
                      const today = new Date();
                      const isDelayed = today > endDate;

                      return isDelayed
                        ? { backgroundColor: "#ffebee" } // Light red for delayed
                        : { backgroundColor: "#e8f5e9" }; // Light green for on schedule
                    })(),
                  ]}
                  onPress={() =>
                    navigation.navigate("(pages)/projectTeam/ProjectDetails", {
                      projectData: project,
                    })
                  }
                >
                  <View style={styles.projectCardContent}>
                    <Text style={styles.projectCardTitle}>
                      {project.attributes.name}
                    </Text>
                    <Text style={styles.projectCardDescription}>
                      {project.attributes.description || "No description"}
                    </Text>

                    <View style={styles.statusRow}>
                      <View style={styles.statusIndicator}>
                        {(() => {
                          const endDate = new Date(project.attributes.end_date);
                          const today = new Date();
                          const isDelayed = today > endDate;

                          return (
                            <>
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
                            </>
                          );
                        })()}
                      </View>
                    </View>

                    <View style={styles.dateContainer}>
                      <Icon name="event" size={16} color="#666" />
                      <Text style={styles.dateText}>
                        End Date:{" "}
                        {project.attributes.end_date
                          ? new Date(
                              project.attributes.end_date
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
              ))
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
});

export default Myactivity;
