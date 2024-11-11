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
import { FontAwesome } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import useProjectStore from "../../../projectStore";
import { getTaskByContractorId } from "../../../src/api/repositories/taskRepository";
import { icons } from "../../../constants";

const { width, height } = Dimensions.get("window");

const ProjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [tasks, setTasks] = useState([]);
  const { projectId, projectData, contractorId } = route.params || {};
  console.log(projectData.attributes)
  const [projectDetails, setProjectDetails] = useState([]);
  const [progress, setProgress] = useState(0); // Track progress percentage

  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (projectId && contractorId) {
        try {
          const allTasks = [];
          const taskData = await getTaskByContractorId(projectId, contractorId);
          console.log('taskdata', ...taskData.data.data)
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
    if (route.params?.projectData) {
      setProjectDetails(route.params.projectDetails);
    }
  }, [route.params?.projectData, setProjectDetails]);

  const project = projectDetails?.attributes || {};

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: width * 0.05, alignItems: 'center' }}>
        <TouchableOpacity 
        onPress={() => navigation.navigate('(pages)/dashboard')}
        >
          <Image source={icons.backarrow}></Image>
        </TouchableOpacity>
        <Text style={styles.header}>Project Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.projectNameContainer}>
          <Text style={styles.projectName}>
            {projectData.attributes.name || "Project Name"}
          </Text>
        </View>

        <View style={styles.calendarContainer}>
          <FontAwesome name="calendar" size={24} color="#F5C37F" />
          <View style={styles.dateContainer}>
            <Text style={styles.dueDateText}>Due Date</Text>
            <Text style={styles.dateText}>{projectData.attributes.end_date || "N/A"}</Text>
          </View>
        </View>

        <Text style={styles.label}>
          Project Manager:{" "}
          <Text style={styles.text}>
            {project.user?.data?.attributes?.username || "N/A"}
          </Text>
        </Text>

        <Text style={styles.label}>Project Details:</Text>
        <Text style={styles.projectDescription}>
          {projectData.attributes.description || "No project description provided."}
        </Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Project Progress:</Text>
          <ProgressBar
            progress={progress}
            width={200}
            color="#66B8FC"
            style={styles.progressBarContainer}
          />
          <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
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
              {task.attributes.standard_task.data.attributes.Description || "No description available."}
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
    backgroundColor: "#FFFFFF",
  },
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: width * 0.05
  },
  header: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#192252",
    paddingHorizontal: width * 0.05
  },
  projectNameContainer: {
    alignItems: "flex-start",
    marginBottom: height * 0.015,
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
  label: {
    fontSize: width * 0.042,
    fontWeight: "bold",
    color: "#192252",
    marginBottom: height * 0.008,
    marginTop: height * 0.02,
  },
  text: {
    fontSize: width * 0.04,
    color: "#000",
  },
  projectDescription: {
    fontSize: width * 0.038,
    color: "#6E6E6E",
    marginBottom: height * 0.02,
    padding: width * 0.035,
    lineHeight: height * 0.025, // Increased line height for readability
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
  },
  progressLabel: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#192252",
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
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
