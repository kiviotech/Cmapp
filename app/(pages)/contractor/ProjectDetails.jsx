import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import useProjectStore from "../../../projectStore";
import { getTaskByContractorId } from "../../../src/api/repositories/taskRepository";
import { icons } from "../../../constants";
import { fetchProjectById } from "../../../src/services/projectService";
import { getProjectTeamById } from "../../../src/api/repositories/projectTeamRepository";

const ProjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [tasks, setTasks] = useState([]);
  const { projectId, projectData, userId } = route.params || {};
  const [projectDetails, setProjectDetails] = useState([]);
  const [progress, setProgress] = useState(0); // Track progress percentage
  const [projectMangerName, setProjectManagerName] = useState("");
  const [jobRole, setJobRole] = useState("");

  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (projectId && userId) {
        try {
          const allTasks = [];
          const taskData = await getTaskByContractorId(projectId, userId);
          allTasks.push(...taskData.data.data);

          setTasks(allTasks);

          // Calculate and set progress with safeguards
          const totalTasks = allTasks?.length || 0;
          const completedTasks =
            allTasks?.filter(
              (task) => task?.attributes?.task_status === "completed"
            ).length || 0;
          const progressPercentage =
            totalTasks > 0 ? completedTasks / totalTasks : 0;

          setProgress(progressPercentage);
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setProgress(0); // Reset progress on error
        }
      }
    };

    fetchProjectTasks();
  }, []);

  useEffect(() => {
    const getProjectDetails = async () => {
      const response = await fetchProjectById(projectId);
      // Find Project Manager ID
      const projectManager = response?.data?.attributes?.approvers?.data.find(
        (approver) => approver?.attributes?.job_role === "Project Manager"
      );

      // Fetch project team data if project manager exists
      if (projectManager) {
        try {
          const teamData = await getProjectTeamById(projectManager.id);
          const managerName =
            teamData?.data?.data?.attributes?.users?.data[0]?.attributes
              ?.username;
          setProjectManagerName(managerName || "N/A");
        } catch (error) {
          console.error("Error fetching project team:", error);
          setProjectManagerName("N/A");
        }
      }
      setProjectDetails(response.data);
    };
    getProjectDetails();
  }, [projectId]); // Add projectId as dependency

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <View style={styles.container1}>
        <TouchableOpacity
          onPress={() => navigation.navigate("(pages)/dashboard")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Project Details</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.projectNameContainer}>
          <Text style={styles.projectName}>
            {projectDetails?.attributes?.name || "Project Name"}
          </Text>
        </View>

        <View style={styles.calendarContainer}>
          <FontAwesome name="calendar" size={26} color="#F5C37F" />
          <View style={styles.dateContainer}>
            <Text style={styles.dueDateText}>Due Date</Text>
            <Text style={styles.dateText}>
              {projectDetails?.attributes?.end_date || "N/A"}
            </Text>
          </View>
        </View>

        <Text style={styles.label}>
          Project Manager:{" "}
          <Text style={styles.text}>{projectMangerName || "N/A"}</Text>
        </Text>

        <Text style={styles.label}>Project Details:</Text>
        <Text style={styles.projectDescription}>
          {projectDetails?.attributes?.description ||
            "No project description provided."}
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

        {tasks?.map((task) => (
          <View key={task?.id} style={styles.taskContainer}>
            <View style={styles.task}>
              <Text style={styles.taskName} numberOfLines={1}>
                {task?.attributes?.standard_task?.data?.attributes?.Name ||
                  "Untitled Task"}
              </Text>
              <Text
                style={[
                  styles.statusStyle,
                  task?.attributes?.task_status === "completed"
                    ? styles.completedStatus
                    : task?.attributes?.task_status === "ongoing"
                    ? styles.ongoingStatus
                    : styles.pendingStatus,
                ]}
              >
                {task?.attributes?.task_status}
              </Text>
            </View>
            <Text style={styles.taskDescription} numberOfLines={2}>
              {task?.attributes?.standard_task?.data?.attributes?.Description ||
                "No description available."}
            </Text>
            <View style={styles.assign}>
              <Text
                style={
                  task?.attributes?.task_status === "completed"
                    ? styles.completionDate
                    : styles.dueDate
                }
              >
                {task?.attributes?.task_status === "completed"
                  ? `On ${task?.attributes?.updatedAt || "N/A"}`
                  : `Due ${task?.attributes?.due_date || "N/A"}`}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingTop: 40,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#192252",
  },
  projectNameContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  projectName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#192252",
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  dateContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 12,
    gap: 5,
  },
  dueDateText: {
    fontSize: 16,
    color: "#333",
  },
  dateText: {
    fontSize: 16,
    color: "#F5C37F",
  },
  statusStyle: {
    fontSize: 14,
    fontWeight: "500",
  },
  noTasksText: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#192252",
    marginBottom: 6,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  projectDescription: {
    fontSize: 15,
    color: "#6E6E6E",
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  progressBarContainer: {
    marginLeft: 8,
    marginTop: 4,
    border: "1px solid red",
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#192252",
    paddingHorizontal: 20,
    width: "40%",
    whiteSpace: "nowrap",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#66B8FC",
    position: "absolute",
    right: 8,
  },
  taskContainer: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: "auto",
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "90%",
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  assign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  taskName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
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
  assignedInfo: {
    fontSize: 14,
    color: "#A0A0A0",
  },
  dueDate: {
    fontSize: 14,
    color: "#FC5275",
  },
  completionDate: {
    fontSize: 14,
    color: "#A8A8A8",
  },
  addButton: {
    backgroundColor: "#5E8BFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
  },
  addButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default ProjectDetails;
