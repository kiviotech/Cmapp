import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
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

const { width, height } = Dimensions.get("window");

const ProjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [tasks, setTasks] = useState([]);
  const { projectId, projectData, contractorId } = route.params || {};
  const [projectDetails, setProjectDetails] = useState([]);
  const [progress, setProgress] = useState(0); // Track progress percentage
  const [projectMangerName, setProjectManagerName] = useState("");

  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (projectId && contractorId) {
        try {
          const allTasks = [];
          const taskData = await getTaskByContractorId(projectId, contractorId);
          allTasks.push(...taskData.data.data); // Accumulate tasks for each project

          setTasks(allTasks); // Set tasks state with accumulated tasks

          // Calculate and set progress
          const completedTasks = allTasks.filter(
            (task) => task.attributes.task_status === "completed"
          ).length;
          const progressPercentage = allTasks.length
            ? completedTasks / allTasks.length
            : 0;
          setProgress(progressPercentage); // Set progress percentage
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    fetchProjectTasks();
  }, []);

  useEffect(() => {
    const getProjectDetails = async () => {
      try {
        const response = await fetchProjectById(projectId);
        console.log("Project Details Response:", response);

        // Find Project Manager from approvers directly
        const projectManager = response?.data?.attributes?.approvers?.data.find(
          (approver) => approver.attributes.job_role === "Project Manager"
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
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    getProjectDetails();
  }, [projectId]); // Add projectId as dependency

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <View style={styles.container1}>
        <TouchableOpacity
          onPress={() => navigation.navigate("(pages)/dashboard")}
        >
          {/* <Image source={icons.backarrow}></Image> */}
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Project Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.projectNameContainer}>
          <Text style={styles.projectName}>
            {projectDetails?.attributes?.name || "Project Name"}
          </Text>
        </View>

        <View style={styles.calendarContainer}>
          <FontAwesome name="calendar" size={24} color="#F5C37F" />
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

        {tasks.map((task) => (
          <View key={task.id} style={styles.taskContainer}>
            <View style={styles.task}>
              <Text style={styles.taskName} numberOfLines={1}>
                {task.attributes.standard_task.data.attributes.Name}
              </Text>
              <Text
                style={
                  task.attributes.task_status === "completed"
                    ? styles.completedStatus
                    : styles.pendingStatus
                }
              >
                {task.attributes.task_status === "completed"
                  ? "Completed"
                  : "Pending..."}
              </Text>
            </View>
            <Text style={styles.taskDescription} numberOfLines={2}>
              {task.attributes.standard_task.data.attributes.Description ||
                "No description available."}
            </Text>
            <View style={styles.assign}>
              {/* <Text style={styles.assignedInfo}>Assigned Contractor Name</Text> */}
              <Text
                style={
                  task.attributes.task_status === "completed"
                    ? styles.completionDate
                    : styles.dueDate
                }
              >
                {task.attributes.task_status === "completed"
                  ? `On ${task.attributes.updatedAt}`
                  : `Due ${task.attributes.due_date}`}
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
    paddingHorizontal: width * 0.04,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingTop: height * 0.05,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    paddingTop: height * 0.05,
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  header: {
    display: "flex",
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: height * 0.015,
    color: "#192252",
  },
  headerText: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: height * 0.015,
    color: "#192252",
    marginLeft: 10,
    marginTop: -5,
    border: "1px solid red",
  },
  projectNameContainer: {
    alignItems: "flex-start",
    // marginBottom: height * 0.015,
    paddingHorizontal: width * 0.05,
  },
  projectName: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#192252",
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.1,
  },
  dateContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: width * 0.03,
  },
  dueDateText: {
    fontSize: width * 0.04,
    color: "#333",
  },
  dateText: {
    fontSize: width * 0.04,
    color: "#F5C37F",
  },
  statusStyle: {
    color: "red",
  },
  noTasksText: {
    paddingHorizontal: width * 0.05,
  },
  label: {
    fontSize: width * 0.042,
    fontWeight: "bold",
    color: "#192252",
    marginBottom: height * 0.008,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  text: {
    fontSize: width * 0.04,
    color: "#000",
  },
  projectDescription: {
    fontSize: width * 0.038,
    color: "#6E6E6E",
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
    lineHeight: height * 0.015, // Increased line height for readability
  },
  progressContainer: {
    flexDirection: "row",

    alignItems: "center",
    marginBottom: height * 0.02,
    paddingVertical: height * 0.01,
  },
  progressBarContainer: {
    marginLeft: width * 0.02,
    marginTop: height * 0.005,
    border: "1px solid red",
  },
  progressLabel: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#192252",
    paddingHorizontal: width * 0.05,
    width: "40%",
    whiteSpace: "nowrap",
  },
  progressPercentage: {
    fontSize: width * 0.035,
    color: "#66B8FC",
    position: "absolute",
    right: width * 0.02,
  },
  taskContainer: {
    backgroundColor: "#FFFFFF",
    padding: width * 0.04,
    borderRadius: 8,
    marginLeft: "10px",
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "90%",
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.005,
  },
  assign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.005,
  },
  taskName: {
    fontSize: width * 0.043,
    fontWeight: "bold",
    color: "#000",
  },
  pendingStatus: {
    fontSize: width * 0.038,
    color: "#FB8951",
  },
  completedStatus: {
    fontSize: width * 0.038,
    color: "#A3D65C",
  },
  assignedInfo: {
    fontSize: width * 0.035,
    color: "#A0A0A0",
  },
  dueDate: {
    fontSize: width * 0.035,
    color: "#FC5275",
  },
  completionDate: {
    fontSize: width * 0.035,
    color: "#A8A8A8",
  },
  addButton: {
    backgroundColor: "#5E8BFF",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
    alignItems: "center",
    marginTop: height * 0.02,
    alignSelf: "center",
  },
  addButtonText: {
    fontSize: width * 0.04,
    color: "#FFFFFF",
  },
});

export default ProjectDetails;
