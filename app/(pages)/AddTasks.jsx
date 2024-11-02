import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import useProjectStore from "../../projectStore";
import CrossPlatformDatePicker from "./CrossPlatformDatePicker";
import { createTask } from "../../src/services/taskService";
import { updateExistingProject } from "../../src/services/projectService";

const TaskMilestoneForm = () => {
  const [milestone, setMilestone] = useState("");
  const [milestoneDate, setMilestoneDate] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskIds, setTaskIds] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();

  const projectData =
    route.params?.projectData || useProjectStore((state) => state.projectData);

  useEffect(() => {
    if (projectData) {
      console.log("Project Data:", projectData);
    }
  }, [projectData]);

  const addTask = async () => {
    if (taskName && taskDate) {
      const newTask = {
        data: {
          name: taskName,
          description: "",
          status: "not_completed",
          deadline: taskDate.toISOString().split("T")[0],
          project: projectData?.id,
        },
      };

      try {
        const response = await createTask(newTask);
        const taskId = response?.data?.id;

        if (taskId) {
          setTasks((prevTasks) => [
            ...prevTasks,
            { name: taskName, date: taskDate.toLocaleDateString() },
          ]);
          setTaskIds((prevIds) => [...prevIds, taskId]);
          console.log("Added Task ID:", taskId);
        } else {
          console.error("Task creation failed. No ID received.");
        }

        setTaskName("");
        setTaskDate(null);
      } catch (error) {
        console.error(
          "Error creating task:",
          error.response?.data || error.message
        );
        alert("Error creating task. Please check the request data.");
      }
    } else {
      alert("Please enter both task name and date.");
    }
  };

  const handleSubmitProject = async () => {
    try {
      const formattedTaskIds = taskIds.map((id) => ({ id }));

      const updatedProjectData = {
        data: {
          name: projectData?.name,
          description: projectData?.description,
          update_status: projectData?.update_status || "pending",
          deadline: milestoneDate
            ? milestoneDate.toISOString().split("T")[0]
            : null,
          tasks: formattedTaskIds,
          registrations: projectData?.registrations || [],
          user: projectData?.user,
          documents: projectData?.documents || [],
          start_date: milestoneDate
            ? milestoneDate.toISOString().split("T")[0]
            : null,
        },
      };

      console.log("Submitting Project Data with Tasks:", updatedProjectData);

      await updateExistingProject(projectData.id, updatedProjectData);
      navigation.navigate("(pages)/AssignContractors");
    } catch (error) {
      console.error(
        "Error updating project with tasks:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.mainHeading}>Add Tasks</Text>

          <View style={styles.sectionTitleContainer}>
            <Text style={styles.title}>Milestone</Text>
            <View style={styles.titleLine}></View>
          </View>

          <Text style={styles.label}>Milestone Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Foundation Laying"
            value={milestone}
            onChangeText={setMilestone}
          />

          <Text style={styles.label}>Expected Completion Date</Text>
          <CrossPlatformDatePicker
            value={milestoneDate}
            onChange={setMilestoneDate}
          />

          <View style={styles.sectionTitleContainer}>
            <Text style={styles.title}>Tasks</Text>
            <View style={styles.titleLine}></View>
          </View>

          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Site Survey"
            value={taskName}
            onChangeText={setTaskName}
          />

          <Text style={styles.label}>Task Due Date</Text>
          <CrossPlatformDatePicker value={taskDate} onChange={setTaskDate} />

          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </TouchableOpacity>

          {tasks.map((task, index) => (
            <View key={index} style={styles.taskItem}>
              <Text style={styles.taskText}>
                {index + 1}. {task.name} - {task.date}
              </Text>
            </View>
          ))}

          <View style={styles.nextButtonContainer}>
            <Button title="Next" onPress={handleSubmitProject} />
          </View>
        </View>
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
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    right: 35,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  titleLine: {
    height: 1,
    backgroundColor: "#C4C4C4",
    flex: 1,
    marginRight: 10,
    left: 10,
    top: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 0,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  addButton: {
    alignItems: "center",
    marginBottom: 20,
    left: 120,
  },
  addButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  taskItem: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginVertical: 5,
  },
  taskText: {
    fontSize: 14,
    color: "#333",
  },
  nextButtonContainer: {
    height: 50,
    marginTop: 20,
    alignSelf: "center",
  },
});

export default TaskMilestoneForm;
