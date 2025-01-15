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

const { width, height } = Dimensions.get("window");

const ProjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projectData: routeProjectData } = route.params || {};

  const { projectData, setProjectData } = useProjectStore();
  const [managerNames, setManagerNames] = useState([]);
  
  useEffect(() => {
    if (routeProjectData) {
      setProjectData(routeProjectData);
    }

    const approverId = routeProjectData?.attributes?.approver?.data?.id;

    const fetchManagerDetails = async () => {
      if (approverId) {
        try {
          const response = await fetchProjectTeamById(approverId);
          const names = response.data.attributes.users.data.map(
            (item) => item.attributes.username
          );
          setManagerNames(names); // Store manager names in state
        } catch (error) {
          console.error("Error fetching manager details:", error);
        }
      }
    };

    fetchManagerDetails();
  }, [routeProjectData, setProjectData]);

  const project = projectData?.attributes || {};

  // Calculate the progress based on task statuses
  const totalTasks = projectData?.taskDetails?.length || 0;
  const completedTasks = projectData?.taskDetails?.filter(
    (taskDetail) => taskDetail.data.attributes.task_status === "completed"
  ).length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Project Details</Text>
        </Text>

        <View style={styles.projectNameContainer}>
          <Text style={styles.projectName}>
            {project.name || "Project Name"}
          </Text>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.dueDateContainer}>
            <FontAwesome name="calendar" size={24} color="#F5C37F" />
            <View style={styles.dateContainer}>
              <Text style={styles.dueDateText}>Due Date</Text>
              <Text style={styles.dateText}>{project.end_date || "N/A"}</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.assignBtn}
            onPress={() => {
              navigation.navigate("(pages)/AssignContractors", {
                projectId: projectData.id,
              });
            }}
            >
              <Text style={styles.assignText}>Assign Tasks</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>
          Project Manager:{" "}
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

        <Text style={styles.label}>All Tasks</Text>

        {projectData?.taskDetails?.length > 0 ? (
          projectData.taskDetails.map((taskDetail, index) => {
            const task = taskDetail.data.attributes;
            const standardTask = task.standard_task?.data?.attributes || {};
            const status = task.task_status;

            let statusText = "Pending...";
            let statusStyle = styles.pendingStatus;

            if (status === "completed") {
              statusText = "Completed";
              statusStyle = styles.completedStatus;
            } else if (status === "ongoing") {
              statusText = "Ongoing";
              statusStyle = styles.ongoingStatus;
            } else if (status === "ahead") {
              statusText = "Ahead of Schedule";
              statusStyle = styles.aheadStatus;
            } else if (status === "delayed") {
              statusText = "Delayed";
              statusStyle = styles.delayedStatus;
            }

            return (
              <View key={index} style={styles.taskContainer}>
                <View style={styles.task}>
                  <Text style={styles.taskName} numberOfLines={1}>
                    {standardTask.Name || "Task Name"}
                  </Text>
                  <Text style={styles.statusStyle}>{statusText}</Text>
                </View>
                <Text style={styles.taskDescription} numberOfLines={2}>
                  {standardTask.Description || "No description available."}
                </Text>
                <View style={styles.assign}>
                  {/* <Text style={styles.dueDate}>
                        {status === "completed"
                          ? `Completed on ${task.updatedAt}`
                          : `Updated on ${task.updatedAt}`}
                      </Text> 
                  */}
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
      <BottomNavigation />
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
  header: {
    display: "flex",
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: height * 0.015,
    color: "#192252",
    marginHorizontal: 20
  },
  headerText: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: height * 0.015,
    color: "#192252",
    marginLeft: 10,
    marginTop: -5,

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
    justifyContent: "space-between",
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.10,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  assignBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderWidth: 1,
    // borderColor: '#000'
  },
  assignText: {
    fontSize: 18
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
    border: '1px solid red',

  },
  progressLabel: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#192252",
    paddingHorizontal: width * 0.05,
    width: '40%',
    whiteSpace: 'nowrap'



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
    marginLeft: '10px',
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: '90%'
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
