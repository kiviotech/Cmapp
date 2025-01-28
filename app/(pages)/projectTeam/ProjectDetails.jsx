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
import { fetchTaskById } from "../../../src/services/taskService";
import InspectionFormModal from "../InspectionFormModal";
import { fetchProjectById } from "../../../src/services/projectService";

const { width, height } = Dimensions.get("window");

const ProjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    projectId,
    projectData: routeProjectData,
    userId,
    tasksData,
  } = route.params || {};
  const { projectData, setProjectData } = useProjectStore();
  const [managerNames, setManagerNames] = useState([]);
  const [jobRole, setJobRole] = useState("");
  const [isInspectionModalVisible, setIsInspectionModalVisible] =
    useState(false);

  useEffect(() => {
    // if (routeProjectData) {
    //   // setProjectData(routeProjectData);
    // }
    const fetchManagerDetails = async () => {
      const projectDetails = await fetchProjectById(projectId);
      setProjectData(projectDetails?.data)
      const approver = projectDetails?.data?.attributes?.approvers?.data.find(
        (item) => item?.attributes?.job_role === "Project Manager"
      );
      const approverId = approver?.id;

      if (approverId) {
      try {
        const response = await fetchProjectTeamById(approverId);
        const names = response?.data?.attributes?.users?.data.map(
          (item) => item?.attributes?.username
        );
        setManagerNames(names[0]); // Store manager names in state
        setJobRole(response?.data?.attributes?.job_role);
      } catch (error) {
        console.error("Error fetching manager details:", error);
      }
      }
    };
    fetchManagerDetails();
    // }, [routeProjectData, setProjectData]);
  }, []);

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

  const project = projectData?.attributes || {};

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
              {project.name || "Project Name"}
            </Text>
          </View>

          <View style={styles.calendarContainer}>
            <View style={styles.dueDateContainer}>
              <FontAwesome name="calendar" size={26} color="#F5C37F" />
              <View style={styles.dateContainer}>
                <Text style={styles.dueDateText}>Due Date</Text>
                <Text style={styles.dateText}>{project.end_date || "N/A"}</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.assignBtn}
                onPress={() => {
                  navigation.navigate("(pages)/AssignContractors", {
                    projectId: projectId || projectData?.id,
                    project_manager: project?.project_manager,
                    project_supervisor: project?.project_supervisor,
                    site_coordinator: project?.site_coordinator,
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
            {project.description || "No project description provided."}
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

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Inspection Form</Text>
            <TouchableOpacity
              style={styles.formButton}
              onPress={() => setIsInspectionModalVisible(true)}
            >
              <Text style={styles.formButtonText}>Open Form</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>All Tasks</Text>
          {tasksData?.length > 0 ? (
            tasksData?.map((task, index) => {
              const taskData = task?.attributes || {};
              const standardTask =
                taskData?.standard_task?.data?.attributes || {};
              const status = taskData.task_status;

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
        <InspectionFormModal
          visible={isInspectionModalVisible}
          onClose={() => setIsInspectionModalVisible(false)}
          onOpenForm={() => {
            setIsInspectionModalVisible(false);
            navigation.navigate("(pages)/InspectionForm", {
              projectId: projectId || projectData?.id,
            });
          }}
          projectId={projectId || projectData?.id}
        />
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
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
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
  formButton: {
    backgroundColor: "#66B8FC",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: "auto",
  },
  formButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ProjectDetails;
