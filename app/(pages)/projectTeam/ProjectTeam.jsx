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
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../../useAuthStore";
import { getProjects } from "../../../src/api/repositories/projectRepository";
import SelectYourProjectCard from "../../../components/SelectYourProjectCard";
import BottomNavigation from "./BottomNavigation";
import { fetchSubmissions } from "../../../src/services/submissionService";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { fetchProjectTeamIdByUserId } from "../../../src/services/projectTeamService";
import { fetchProjectDetailsByApproverId } from "../../../src/services/projectService";
import apiClient, {
  BASE_URL,
  MEDIA_BASE_URL,
  URL,
} from "../../../src/api/apiClient";
import { fetchTasks } from "../../../src/services/taskService";

const data = [
  {
    id: "1",
    title: "Inspection",
    projectName: "Project Name",
    date: "Mon, 10 July 2022",
    time: "9 AM - 10:30 AM",
  },
  {
    id: "2",
    title: "Inspection",
    projectName: "Project Name",
    date: "Mon, 10 July 2022",
    time: "9 AM - 10:30 AM",
  },
  {
    id: "3",
    title: "Inspection",
    projectName: "Project Name",
    date: "Mon, 10 July 2022",
    time: "9 AM - 10:30 AM",
  },
];

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

const getProjectStatus = (project) => {
  const status = project?.attributes?.project_status;
  switch (status) {
    case "completed":
      return { text: "Completed", color: "#4CAF50" };
    case "ongoing":
      return { text: "Ongoing", color: "#2196F3" };
    case "pending":
      return { text: "Pending", color: "#FFA000" };
    default:
      return { text: "Unknown", color: "#757575" };
  }
};

const ProjectTeam = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const navigation = useNavigation();
  // const [projectsDetail, setProjectsDetail] = useState([]);
  // const [tasksDetail, setTasksDetail] = useState([]);
  // const [selectedProjectId, setSelectedProjectId] = useState(null);
  // const [jobProfile, setJobProfile] = useState("");
  // const [subcategories, setSubcategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  // const [projectTeamId, setProjectTeamId] = useState(null);
  const [projectDetails, setProjectDetails] = useState([]);
  // const [taskDetails, setTaskDetails] = useState([]);
  const { user, designation, role, permissions } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1); // Current page
  const pageSize = 5; // Number of tasks per page
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Function to fetch tasks for a specific page
  const fetchTasksWithPagination = async (userId, page) => {
    // if (isLoading) return; // Prevent multiple calls if already loading
    setIsLoading(true); // Start loading
    try {
      const response = await fetchTasks(userId, page, pageSize);
      const data = response.data;

      if (data && data.length > 0) {
        const projectsData = data
          .map((taskData) => taskData?.attributes?.project?.data)
          .filter(
            (project, index, self) =>
              project && self.findIndex((p) => p?.id === project.id) === index
          );

        setProjects(projectsData); // Append unique projects
        // Append tasks and projects while ensuring no duplicates
        setTasks(data);
        // Set total pages based on the response
        setTotalPages(Math.ceil(response.meta.pagination.total / pageSize));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Initial fetch on page load
  useEffect(() => {
    if (user && user.id) {
      fetchTasksWithPagination(user.id, 1); // Load the first page
      setCurrentPage(1); // Reset the page to 1
    }
  }, [user]);

  // Fetch tasks for the selected page
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Do not fetch if page is out of range
    setCurrentPage(page); // Update the current page
    fetchTasksWithPagination(user.id, page); // Fetch data for the new page
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i && styles.activePageButton,
          ]}
          onPress={() => handlePageChange(i)}
        >
          <Text
            style={[
              styles.pageText,
              currentPage === i && styles.activePageText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.paginationContainer}>{pages}</View>;
  };

  const ongoingProjectsCount = projects.filter(
    (item) => item?.attributes?.project_status === "ongoing"
  ).length;

  const completedProjectsCount = projects.filter(
    (item) => item?.attributes?.project_status === "completed"
  ).length;

  // useEffect(() => {
  //   const fetchProjectDetails = async () => {
  //     if (projectTeamId) {
  //       try {
  //         const projectResponse = await fetchProjectDetailsByApproverId(
  //           projectTeamId
  //         );
  //         const projects = projectResponse.data;
  //         const projectsWithTasks = await Promise.all(
  //           projects.map(async (project) => {
  //             const tasks = project.attributes.tasks.data;
  //             const taskDetails = await Promise.all(
  //               tasks.map(async (task) => {
  //                 const taskResponse = await apiClient.get(
  //                   `/tasks/${task.id}?populate=*`
  //                 );

  //                 return { id: task.id, ...taskResponse.data };
  //               })
  //             );
  //             return { ...project, taskDetails };
  //           })
  //         );

  //         setProjectDetails(projectsWithTasks);
  //       } catch (error) {
  //         console.error("Error fetching project details:", error);
  //       }
  //     }
  //   };

  //   fetchProjectDetails();
  // }, [projectTeamId]);

  // useEffect(() => {
  //   const fetchProjectDetails = async () => {
  //     if (projectTeamId) {
  //       try {
  //         const response = await fetchProjectDetailsByApproverId(projectTeamId);
  //         setProjectDetails(response.data); // Store project details with tasks
  //       } catch (error) {
  //         console.error("Error fetching project details:", error);
  //       }
  //     }
  //   };
  //   fetchProjectDetails();
  // }, [projectTeamId]);

  // useEffect(() => {
  //   const fetchTaskDetails = async () => {
  //     const allTaskDetails = [];

  //     for (const project of projectDetails) {
  //       const tasks = project.attributes.tasks.data;
  //       for (const task of tasks) {
  //         try {
  //           const taskResponse = await apiClient.get(
  //             `${BASE_URL}/tasks/${task.id}?populate=*`
  //           );
  //           allTaskDetails.push(taskResponse.data);
  //         } catch (error) {
  //           console.error(
  //             `Error fetching details for task ID ${task.id}:`,
  //             error
  //           );
  //         }
  //       }
  //     }

  //     setTaskDetails(allTaskDetails);
  //   };

  //   if (projectDetails.length > 0) {
  //     fetchTaskDetails();
  //   }
  // }, [projectDetails]);

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

  // useEffect(() => {
  //   let isMounted = true;

  //   const fetchProjects = async () => {
  //     setIsLoading(true);
  //     try {
  //       const projectData = await getProjects();
  //       if (isMounted && projectData?.data?.data) {
  //         const uniqueProjects = Array.from(
  //           new Map(
  //             projectData.data.data.map((item) => [item.id, item])
  //           ).values()
  //         );
  //         setProjectsDetail(uniqueProjects);
  //         if (uniqueProjects.length > 0) {
  //           setSelectedProjectId(uniqueProjects[0]?.id);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching projects:", error);
  //       if (isMounted) {
  //         setProjectsDetail([]);
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchProjects();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchRequests = async () => {
        try {
          const response = await fetchSubmissions();
          const submissions = response?.data || [];
          const recentRequests = submissions
            .sort(
              (a, b) =>
                new Date(b?.attributes?.createdAt) -
                new Date(a?.attributes?.createdAt)
            )
            .slice(0, 2);
          setRequests(recentRequests);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };

      fetchRequests();
    }, [])
  );

  const filteredTasks = (tasks) => {
    return tasks.filter((taskDetail) =>
      taskDetail?.attributes?.standard_task?.data?.attributes?.Name?.toLowerCase().includes(
        searchQuery.toLowerCase()
      )
    );
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.userInfoContainer}>
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/165383754?v=4",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userRole}>{designation}</Text>
          </View>
          {/* <TouchableOpacity style={styles.searchIcon}>
            <Icon name="search" size={24} color="#333" />
          </TouchableOpacity> */}
        </View>

        <Text style={styles.sectionHeader}>Project Overview</Text>
        <View style={styles.overviewContainer}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber1}>{projects.length}</Text>
            <Text style={styles.overviewLabel1}>Total Projects</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber2}>{ongoingProjectsCount}</Text>
            <Text style={styles.overviewLabel2}>Active</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber3}>{completedProjectsCount}</Text>
            <Text style={styles.overviewLabel3}>Completed</Text>
          </View>
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
                const isDelayed =
                  project?.attributes?.project_status === "delayed"; // Define isDelayed based on status
                const projectStatus = {
                  text:
                    project?.attributes?.project_status
                      ?.charAt(0)
                      ?.toUpperCase() +
                    project?.attributes?.project_status?.slice(1),
                }; // Define projectStatus

                return (
                  <TouchableOpacity
                    key={project.id}
                    style={[
                      styles.projectCard,
                      project?.attributes?.project_status === "pending"
                        ? { backgroundColor: "#ffebee" }
                        : { backgroundColor: "#e8f5e9" },
                    ]}
                    onPress={() =>
                      navigation.navigate(
                        "(pages)/projectTeam/ProjectDetails",
                        {
                          projectId: project.id,
                          projectData: project,
                          userId: user.id,
                          tasksData: tasks,
                        }
                      )
                    }
                  >
                    <View style={styles.projectCardContent}>
                      {/* Project Name and Description */}
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

                      {/* Project Status */}
                      <View style={styles.statusContainer}>
                        <View>
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
                      </View>

                      {/* Project End Date */}
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
          <Text style={styles.sectionHeader}>Requests</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("(pages)/Request")}
          >
            <Text style={styles.seeAllButton}>See all</Text>
          </TouchableOpacity>
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
                  ?.attributes?.name || "Project"}
              </Text>
              <Text style={styles.requestDescription}>
                {request?.attributes?.comment
                  ? request?.attributes?.comment?.charAt(0).toUpperCase() +
                    request?.attributes?.comment?.slice(1)
                  : "No description available."}
              </Text>

              <View style={styles.requestStatusContainer}>
                <Text
                  style={[
                    styles.requestStatus,
                    {
                      color:
                        request?.attributes?.status === "approved"
                          ? "#4CAF50" // green
                          : request?.attributes?.status === "pending"
                          ? "#FF9800" // orange
                          : request?.attributes?.status === "rejected"
                          ? "#F44336" // red
                          : "black", // default color
                    },
                  ]}
                >
                  {request?.attributes?.status
                    ? request?.attributes?.status.charAt(0).toUpperCase() +
                      request?.attributes?.status.slice(1).toLowerCase()
                    : "Pending"}
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

        <View style={styles.container1}>
          <View style={styles.milestoneContainer}>
            <Text style={styles.milestoneHeader}>Upcoming Milestones</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <>
          <FlatList
            data={tasks.filter((task) =>
              task?.attributes?.project?.data?.attributes?.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )}
            renderItem={({ item: task }) => {
              const taskImageUrl = task?.attributes?.documents?.data?.[0]
                ?.attributes?.url
                ? `${URL}${task?.attributes?.documents?.data[0]?.attributes?.url}`
                : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

              return (
                <View key={task.id} style={styles.milestoneCard}>
                  <Text style={styles.milestoneTitle}>
                    {/* {task?.attributes?.project?.data?.attributes?.name ||
                      "Project"} */}
                  </Text>
                  <Image
                    source={{ uri: taskImageUrl }}
                    style={styles.milestoneImage}
                  />
                  <View style={styles.milestoneContent}>
                    <View style={styles.milestoneHeaderContainer}>
                      <View style={styles.projectTaskName}>
                        <Text style={styles.milestoneTitle}>
                          {task?.attributes?.standard_task?.data?.attributes
                            ?.Name || "Task"}
                        </Text>
                      </View>
                      <View style={styles.substituteButton}>
                        <Text style={styles.substituteText}>Substructure</Text>
                      </View>
                    </View>
                    <Text style={styles.milestoneDescription}>
                      {task?.attributes?.standard_task?.data?.attributes
                        .Description ||
                        "No description available for this task."}
                    </Text>
                    <View style={styles.divider} />
                    <Text style={styles.deadlineText}>
                      <Icon name="event" size={16} color="#333" /> Deadline:{" "}
                      {task?.attributes?.due_date || "No deadline specified"}
                    </Text>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() =>
                        navigation.navigate("(pages)/taskDetails", {
                          taskData: task,
                        })
                      }
                    >
                      <Icon name="file-upload" size={16} color="#fff" />
                      <Text style={styles.uploadButtonText}>
                        Upload your Proof of work
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.noProjectsText}>No tasks available.</Text>
              </View>
            }
          />
          {totalPages > 1 && renderPagination()}
        </>
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 20,
    marginTop: -10,
  },
  pageButton: {
    padding: "8px 12px",
    border: "1px solid #A5A5A5",
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    minWidth: "40px",
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  activePageButton: {
    backgroundColor: "#007bff",
  },
  pageText: {
    color: "#000",
  },
  activePageText: {
    color: "#fff",
  },
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    // backgroundColor: "#fff",
    width: "100%",
    paddingBottom: 80,
  },
  noProjectsText: {
    color: "red",
    paddingBottom: "20px",
    fontSize: "18px",
    // textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    paddingBottom: 100,
  },
  container1: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingVertical: 20,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  userRole: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  searchIcon: {
    marginLeft: "auto",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
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
    // borderWidth:1,
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
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
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  milestoneContainer: {
    flex: 1,
  },
  milestoneHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  taskStatus: {
    color: "#888",
    fontSize: 14,
  },
  filterIcon: {
    marginLeft: "auto",
  },
  milestoneCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  milestoneImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  milestoneContent: {
    paddingBottom: 10,
  },
  milestoneHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  substituteButton: {
    backgroundColor: "#e3f2fd",
    padding: 5,
    borderRadius: 5,
  },
  substituteText: {
    color: "#1e90ff",
    fontSize: 14,
  },
  projectName: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  milestoneDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 10,
  },
  deadlineText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: "#1e90ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  statusContainer: {
    marginVertical: 8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  projectStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },

  //   ~==================================================================================

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e1e1e",
    marginBottom: 16,
  },
  carousel: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    width: Dimensions.get("window").width * 0.75, // 75% of screen width for each card
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#576CE4",
  },
  projectName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  divider: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 45,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  uploadProofButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadProofText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  statusApproved: {
    color: "#4CAF50", // green
  },
  statusPending: {
    color: "#FF9800", // orange
  },
  statusRejected: {
    color: "#F44336", // red
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
  viewLink: {
    color: "#1e90ff",
  },
  requestsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  seeAllButton: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ProjectTeam;
