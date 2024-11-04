import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import useProjectStore from "../../../projectStore";

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
          <Text style={styles.progressPercentage}>68%</Text>
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
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  projectNameContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  projectName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#192252",
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 8,
  },
  dueDateText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#F5C37F",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#192252",
    marginBottom: 5,
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  projectDescription: {
    fontSize: 14,
    color: "#A0A0A0",
    marginBottom: 20,
    padding: 10,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  progressBarContainer: {
    marginLeft: 5,
    marginTop: 5,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#192252",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#66B8FC",
    position: "absolute",
    right: 0,
  },
  taskContainer: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
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
    marginTop: 10,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  pendingStatus: {
    fontSize: 14,
    color: "#FB8951",
  },
  completedStatus: {
    fontSize: 14,
    color: "#A3D65C",
  },
  assignedInfo: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  dueDate: {
    fontSize: 12,
    color: "#FC5275",
  },
  completionDate: {
    fontSize: 12,
    color: "#A8A8A8",
  },
  addButton: {
    backgroundColor: "#5E8BFF",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    height: 50,
    width: 150,
    alignSelf: "center",
  },
  addButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default ProjectDetails;
