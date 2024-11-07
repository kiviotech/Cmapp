import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import useProjectStore from "../../../projectStore";

const { width, height } = Dimensions.get("window");

const ProjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projectData: routeProjectData } = route.params || {};

  const { projectData, setProjectData } = useProjectStore();

  useEffect(() => {
    if (routeProjectData) {
      setProjectData(routeProjectData);
    }
  }, [routeProjectData, setProjectData]);

  const project = projectData?.attributes || {};

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Project Details</Text>

        <View style={styles.projectNameContainer}>
          <Text style={styles.projectName}>
            {project.name || "Project Name"}
          </Text>
        </View>

        <View style={styles.calendarContainer}>
          <FontAwesome name="calendar" size={24} color="#F5C37F" />
          <View style={styles.dateContainer}>
            <Text style={styles.dueDateText}>Due Date</Text>
            <Text style={styles.dateText}>{project.deadline || "N/A"}</Text>
          </View>
        </View>

        <Text style={styles.label}>
          Project Manager:{" "}
          <Text style={styles.text}>
            {project.user?.data?.attributes?.username || "N/A"}
            {console.log("project user", project)}
          </Text>
        </Text>

        <Text style={styles.label}>Project Details:</Text>
        <Text style={styles.projectDescription}>
          {project.description || "No project description provided."}
        </Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Project Progress:</Text>
          <ProgressBar
            progress={0.68}
            width={200}
            color="#66B8FC"
            style={styles.progressBarContainer}
          />
          {/* <Text style={styles.progressPercentage}>68%</Text> */}
        </View>

        <Text style={styles.label}>All Tasks</Text>

        {project.tasks?.data?.map((task) => (
          <View key={task.id} style={styles.taskContainer}>
            <View style={styles.task}>
              <Text style={styles.taskName}>{task.attributes.name}</Text>
              <Text
                style={
                  task.attributes.status === "completed"
                    ? styles.completedStatus
                    : styles.pendingStatus
                }
              >
                {task.attributes.status === "completed"
                  ? "Completed"
                  : "Pending..."}
              </Text>
            </View>
            <View style={styles.assign}>
              <Text style={styles.assignedInfo}>Assigned Contractor Name</Text>
              <Text
                style={
                  task.attributes.status === "completed"
                    ? styles.completionDate
                    : styles.dueDate
                }
              >
                {task.attributes.status === "completed"
                  ? `On ${task.attributes.updatedAt}`
                  : `Due ${task.attributes.deadline}`}
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
    paddingHorizontal: width * 0.03,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#192252",
  },
  projectNameContainer: {
    alignItems: "flex-start",
    marginBottom: height * 0.015,
  },
  projectName: {
    fontSize: width * 0.06,
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
    alignItems: "center",
    marginLeft: width * 0.02,
  },
  dueDateText: {
    fontSize: width * 0.04,
    color: "#000",
  },
  dateText: {
    fontSize: width * 0.04,
    color: "#F5C37F",
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#192252",
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  text: {
    fontSize: width * 0.04,
    color: "#000",
  },
  projectDescription: {
    fontSize: width * 0.038,
    color: "#A0A0A0",
    marginBottom: height * 0.02,
    padding: width * 0.04,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
    position: "relative",
    paddingVertical: height * 0.01, // Reduced padding
  },
  progressBarContainer: {
    marginLeft: width * 0.02,
    marginTop: height * 0.005, // Reduced margin to make the section more compact
  },
  progressLabel: {
    fontSize: width * 0.04, // Slightly smaller font size
    fontWeight: "bold",
    color: "#192252",
  },
  progressPercentage: {
    fontSize: width * 0.035, // Smaller font size
    color: "#66B8FC",
    position: "absolute",
    right: 0,
  },
  taskContainer: {
    backgroundColor: "#FFFFFF",
    padding: width * 0.04,
    borderRadius: 10,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.01,
  },
  taskName: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#000",
  },
  pendingStatus: {
    fontSize: width * 0.04,
    color: "#FB8951",
  },
  completedStatus: {
    fontSize: width * 0.04,
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
