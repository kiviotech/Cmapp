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
  //       console.log("error");
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
          <Image style={styles.userImage} source={icons.userProfile} />
        </View>
        <View style={styles.profileDetailSection}>
          <Text style={styles.userName}>{user.username}</Text>
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
                    project.attributes.project_status === "ongoing"
                      ? { backgroundColor: "#e8f5e9" }
                      : { backgroundColor: "#ffebee" },
                  ]}
                  onPress={() =>
                    navigation.navigate("(pages)/projectTeam/ProjectDetails", {
                      projectData: project,
                    })
                  }
                >
                  <View style={styles.projectCardContent}>
                    {/* Project Name and Description */}
                    <Text style={styles.projectTitle}>
                      {project.attributes.name}
                    </Text>
                    <Text style={styles.projectDescription}>
                      {project.attributes.description}
                    </Text>

                    {/* Project Status */}
                    <Text style={styles.projectStatus}>
                      ●{" "}
                      {project.attributes.project_status
                        ? "Status"
                        : "Status unknown"}
                      : {project.attributes.project_status || "N/A"}
                    </Text>

                    {/* Additional Project Info */}
                    <View style={styles.projectStatusContainer}>
                      <Icon
                        name={
                          project.attributes.update_status === "ahead"
                            ? "check-circle"
                            : "error"
                        }
                        size={16}
                        color={
                          project.attributes.update_status === "ahead"
                            ? "green"
                            : "red"
                        }
                      />
                      <Text style={styles.projectStatusText}>
                        {project.attributes.update_status === "ahead"
                          ? "Ahead of Schedule"
                          : "Delayed"}
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
          <View key={request?.id} style={styles.requestItem}>
            <View>
              <Text style={styles.requestTitle}>
                Submitted{" "}
                {request?.attributes?.task?.data?.attributes?.project?.data
                  ?.attributes?.name || "Project"}{" "}
                Work
              </Text>
              <Text style={styles.requestDescription}>
                {request?.attributes?.description ||
                  "No description available."}
              </Text>
              <View style={styles.requestStatusContainer}>
                <Text style={styles.requestStatusPending}>
                  {request?.attributes?.status || "Pending"}
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
          </View>
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
    paddingBottom: 80,
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
    width: 250,
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  projectStatus: {
    fontSize: 14,
    color: "#ff5252",
    marginBottom: 10,
  },
  projectStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  projectStatusText: {
    marginLeft: 5,
    fontSize: 14,
    color: "green",
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
});

export default Myactivity;
