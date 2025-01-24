import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import BottomNavigation from "./BottomNavigation";
import useProjectStore from "../../../projectStore";
import { fetchProjectTeamById } from "../../../src/services/projectTeamService";
import {
  fetchTaskById,
  fetchTasks,
  fetchTaskByProjectIdAndUserId,
} from "../../../src/services/taskService";
import { getProjectById } from "../../../src/api/repositories/projectRepository";
import useAuthStore from "../../../useAuthStore";

const { width, height } = Dimensions.get("window");

const ProjectDetailsPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    projectId,
    projectName,
    // tasksData,
  } = route.params || {};
  const { projectData, setProjectData } = useProjectStore();
  const [managerNames, setManagerNames] = useState([]);
  const [jobRole, setJobRole] = useState("");
  const [tasksData, setTasksData] = useState([]);
  const { user } = useAuthStore();
  const pageSize = 5; // Number of tasks per page
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    // const approverId = routeProjectData?.attributes?.approvers?.data[0]?.id;
    const fetchProjectById = async () => {
      try {
        const response = await getProjectById(projectId);
        setProjectData(response?.data?.data?.attributes);
      } catch (error) {
        console.error("Error fetching manager details:", error);
      }
      // }
    };
    fetchProjectById();
    // }, [routeProjectData, setProjectData]);
  }, []);

  useEffect(() => {
    const fetchManagerDetails = async () => {
      // console.log('approverId', routeProjectData.attributes)
      // if (approverId) {
      try {
        const response = await fetchProjectTeamById("4");
        const names = response?.data?.attributes?.users?.data.map(
          (item) => item?.attributes?.username
        );
        setManagerNames(names[0]); // Store manager names in state
        setJobRole(response?.data?.attributes?.job_role);
      } catch (error) {
        console.error("Error fetching manager details:", error);
      }
      // }
    };
    fetchManagerDetails();
  }, []);

  const fetchTasksWithPagination = async () => {
    setIsLoading(true);
    try {
      const response = await fetchTaskByProjectIdAndUserId(projectId, userId);
      const data = response.data;

      if (data) {
        setTasksData(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffect to use projectId and userId
  useEffect(() => {
    if (userId && projectId) {
      fetchTasksWithPagination();
    }
  }, [userId, projectId]);

  // Update page change handler
  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
  //     setCurrentPage(newPage);
  //     fetchTasksWithPagination();
  //   }
  // };

  // Update pagination render function
  // const renderPagination = () => {
  //   if (totalPages <= 1) return null;

  //   const renderPageButton = (pageNum) => (
  //     <TouchableOpacity
  //       key={pageNum}
  //       style={[
  //         styles.pageButton,
  //         currentPage === pageNum && styles.activePageButton,
  //       ]}
  //       onPress={() => handlePageChange(pageNum)}
  //       disabled={currentPage === pageNum}
  //     >
  //       <Text
  //         style={[
  //           styles.pageText,
  //           currentPage === pageNum && styles.activePageText,
  //         ]}
  //       >
  //         {pageNum}
  //       </Text>
  //     </TouchableOpacity>
  //   );

  //   let pages = [];

  //   // Show maximum 5 pages
  //   const maxVisiblePages = 5;
  //   let startPage, endPage;

  //   if (totalPages <= maxVisiblePages) {
  //     // If total pages are less than or equal to max visible pages, show all pages
  //     startPage = 1;
  //     endPage = totalPages;
  //   } else {
  //     // Calculate start and end pages to show current page in the middle when possible
  //     const middlePoint = Math.floor(maxVisiblePages / 2);

  //     if (currentPage <= middlePoint + 1) {
  //       // Near the start
  //       startPage = 1;
  //       endPage = maxVisiblePages;
  //     } else if (currentPage >= totalPages - middlePoint) {
  //       // Near the end
  //       startPage = totalPages - maxVisiblePages + 1;
  //       endPage = totalPages;
  //     } else {
  //       // In the middle
  //       startPage = currentPage - middlePoint;
  //       endPage = currentPage + middlePoint;
  //     }
  //   }

  //   // Add pages
  //   for (let i = startPage; i <= endPage; i++) {
  //     pages.push(renderPageButton(i));
  //   }

  //   return <View style={styles.paginationContainer}>{pages}</View>;
  // };

  // const fetchProjectTasks = async () => {
  //   try {
  //     const taskIds =
  //       routeProjectData?.attributes?.tasks?.data?.map((task) => task.id) || [];
  //     const taskPromises = taskIds.map(async (taskId) => {
  //       const response = await fetchTaskById(taskId);
  //       return response;
  //     });

  //     const taskResults = await Promise.all(taskPromises);
  //     setTasks(taskResults);
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //   }
  // };

  // Calculate the progress based on task statuses
  const totalTasks = tasksData?.length || 0;
  const completedTasks =
    tasksData?.filter((task) => task?.attributes?.task_status === "completed")
      .length || 0;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Project Details</Text>
          </View>

          <View style={styles.projectNameContainer}>
            <Text style={styles.projectName}>
              {projectName || "Project Name"}
            </Text>
          </View>

          <View style={styles.calendarContainer}>
            <View style={styles.dueDateContainer}>
              <FontAwesome name="calendar" size={26} color="#F5C37F" />
              <View style={styles.dateContainer}>
                <Text style={styles.dueDateText}>Due Date</Text>
                <Text style={styles.dateText}>
                  {projectData?.end_date || "N/A"}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.assignBtn}
                onPress={() => {
                  navigation.navigate("(pages)/AssignContractors", {
                    projectId: projectData?.data?.id,
                  });
                }}
              >
                <Text style={styles.assignText}>Assign Tasks</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>
            {jobRole || "Project Manager"}:{" "}
            <Text style={styles.text}>{managerNames || "N/A"}</Text>
          </Text>

          <Text style={styles.label}>Project Details:</Text>
          <Text style={styles.projectDescription}>
            {projectData?.description || "No project description provided."}
          </Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Your Progress:</Text>
            <ProgressBar
              progress={progress}
              width={180}
              height={10}
              color="#66B8FC"
              style={styles.progressBarContainer}
            />
            <Text style={styles.progressPercentage}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          <Text style={styles.label}>All Tasks</Text>

          {tasksData?.length > 0 ? (
            tasksData?.map((task, index) => {
              const taskData = task?.attributes || {};
              const standardTask =
                taskData?.standard_task?.data?.attributes || {};
              const status = taskData?.task_status;

              return (
                <View key={index} style={styles.taskContainer}>
                  <View style={styles.task}>
                    <Text style={styles.taskName} numberOfLines={1}>
                      {standardTask.Name || "Task Name"}
                    </Text>
                    <Text
                      style={[
                        styles.statusStyle,
                        status === "completed"
                          ? styles.completedStatus
                          : status === "ongoing"
                          ? styles.ongoingStatus
                          : styles.pendingStatus,
                      ]}
                    >
                      {status === "completed"
                        ? "Completed"
                        : status === "ongoing"
                        ? "Ongoing"
                        : "Pending"}
                    </Text>
                  </View>
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {standardTask.Description || "No description available."}
                  </Text>
                  <View style={styles.assign}>
                    <Text style={styles.dueDate}>
                      Due:{" "}
                      {taskData.due_date
                        ? new Date(taskData.due_date)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, "-")
                        : "N/A"}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.noTasksContainer}>
              <Text style={styles.noTasksText}>No tasks available</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.bottomNavContainer}>
          <BottomNavigation />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    elevation: 8, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Increased to prevent content from being hidden behind BottomNavigation
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#192252",
    marginLeft: 8,
  },
  projectNameContainer: {
    marginBottom: 16,
  },
  projectName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#192252",
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateContainer: {
    marginLeft: 12,
    gap: 5,
  },
  dueDateText: {
    fontSize: 14,
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#F5C37F",
    fontWeight: "500",
  },
  assignBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  assignText: {
    fontSize: 16,
    color: "#192252",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#192252",
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: "#000",
    fontWeight: "normal",
  },
  projectDescription: {
    fontSize: 14,
    color: "#6E6E6E",
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 5,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#192252",
    width: "35%",
  },
  progressBarContainer: {
    marginLeft: 8,
  },
  progressPercentage: {
    fontSize: 14,
    color: "#66B8FC",
    marginLeft: 8,
  },
  taskContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#6E6E6E",
    marginBottom: 8,
    lineHeight: 20,
  },
  pendingStatus: {
    fontSize: 14,
    color: "#FB8951",
    fontWeight: "500",
  },
  ongoingStatus: {
    fontSize: 14,
    color: "#66B8FC",
    fontWeight: "500",
  },
  completedStatus: {
    fontSize: 14,
    color: "#A3D65C",
    fontWeight: "500",
  },
  dueDate: {
    fontSize: 13,
    color: "#FC5275",
  },
  noTasksContainer: {
    padding: 16,
    alignItems: "center",
  },
  noTasksText: {
    fontSize: 16,
    color: "#6E6E6E",
  },
});

export default ProjectDetailsPage;
