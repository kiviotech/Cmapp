import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { fetchSubContractors } from "../../src/services/subContractorService";
import { fetchUsers } from "../../src/services/userService";
import {
  fetchProjectById,
  createNewProject,
} from "../../src/services/projectService";
import { updateTask, fetchTasks } from "../../src/services/taskService";
import useProjectStore from "../../projectStore";
import { useRoute, useNavigation } from "@react-navigation/native";

const AssignContractors = () => {
  const [projectId, setProjectId] = useState("");
  const [contractorTypeOpen, setContractorTypeOpen] = useState(false);
  const [contractorTypeValue, setContractorTypeValue] = useState(null);
  const [contractorTypeItems, setContractorTypeItems] = useState([]);
  const [contractorOpen, setContractorOpen] = useState(false);
  const [contractorValue, setContractorValue] = useState(null);
  const [contractorItems, setContractorItems] = useState([]);
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskValue, setTaskValue] = useState(null);
  const [taskItems, setTaskItems] = useState([]);
  const [assignedContractors, setAssignedContractors] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();
  const projectData =
    route.params?.projectData || useProjectStore((state) => state.projectData);

  useEffect(() => {
    const loadProjectDetails = async () => {
      if (projectData?.id) {
        try {
          const response = await fetchProjectById(projectData.id);
          const projectDetails = response.data;

          setProjectId(projectDetails.id);

          const tasks = projectDetails.attributes.tasks?.data || [];
          setTaskItems(
            tasks.map((task) => ({
              label: task.attributes.name,
              value: task.id,
              key: task.id.toString(),
            }))
          );
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };

    loadProjectDetails();
  }, [projectData]);

  useEffect(() => {
    const loadContractorTypes = async () => {
      try {
        const response = await fetchSubContractors();
        const contractors = response.data || response;

        if (!Array.isArray(contractors)) {
          console.error("Unexpected format: contractors is not an array");
          return;
        }

        const types = contractors.map((contractor) => ({
          label: contractor.attributes.name,
          value: contractor.id,
          key: contractor.id.toString(),
        }));

        setContractorTypeItems(types);
      } catch (error) {
        console.error("Error fetching contractor types:", error);
      }
    };

    loadContractorTypes();
  }, []);

  useEffect(() => {
    const loadContractors = async () => {
      try {
        const users = await fetchUsers();

        const contractors = users.filter(
          (user) => user.designation?.Name === "Contractor"
        );

        setContractorItems(
          contractors.map((user) => ({
            label: user.username,
            value: user.id,
            key: user.id.toString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    loadContractors();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksResponse = await fetchTasks();

        const tasks = Array.isArray(tasksResponse)
          ? tasksResponse
          : tasksResponse.data || [];

        setTaskItems(
          tasks.map((task) => ({
            label: task.attributes.name,
            value: task.id,
            key: task.id.toString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, []);

  const handleAddContractor = () => {
    if (!contractorTypeValue || !contractorValue || !taskValue) {
      Alert.alert("Error", "Please select all required fields.");
      return;
    }

    const contractorTypeLabel = contractorTypeItems.find(
      (item) => item.value === contractorTypeValue
    )?.label;
    const contractorLabel = contractorItems.find(
      (item) => item.value === contractorValue
    )?.label;
    const taskLabel = taskItems.find((item) => item.value === taskValue)?.label;

    const newContractor = {
      contractorType: contractorTypeValue,
      contractor: contractorValue,
      task: taskValue,
      contractorTypeLabel,
      contractorLabel,
      taskLabel,
    };

    setAssignedContractors([...assignedContractors, newContractor]);
    setContractorTypeValue(null);
    setContractorValue(null);
    setTaskValue(null);
  };

  const handleFinishProjectSetup = async () => {
    if (assignedContractors.length === 0) {
      Alert.alert("Error", "Please add at least one contractor.");
      return;
    }

    try {
      for (const contractor of assignedContractors) {
        const taskUpdateData = {
          data: {
            assigned_to: contractor.contractor,
            sub_contractor: contractor.contractorType,
            project: projectId,
          },
        };
        await updateTask(contractor.task, taskUpdateData);
      }

      console.log("Project assignment data submitted:", assignedContractors);
      navigation.navigate("(pages)/dashboard");
      Alert.alert("Success", "Project setup completed and tasks updated!");
    } catch (error) {
      console.error("Error updating tasks:", error);
      Alert.alert(
        "Error",
        "There was an issue saving the project assignments."
      );
    }
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.mainHeading}>Assign Contractors</Text>

          <Text style={styles.label}>Contractor Type</Text>
          <DropDownPicker
            open={contractorTypeOpen}
            value={contractorTypeValue}
            items={contractorTypeItems}
            setOpen={setContractorTypeOpen}
            setValue={setContractorTypeValue}
            setItems={setContractorTypeItems}
            placeholder="Select the contractor type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
            zIndexInverse={1000}
          />

          <Text style={styles.label}>Contractor</Text>
          <DropDownPicker
            open={contractorOpen}
            value={contractorValue}
            items={contractorItems}
            setOpen={setContractorOpen}
            setValue={setContractorValue}
            setItems={setContractorItems}
            placeholder="Select Contractor"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            disabled={!contractorTypeValue}
            zIndex={2000}
            zIndexInverse={2000}
          />

          <Text style={styles.label}>Assign Task</Text>
          <DropDownPicker
            open={taskOpen}
            value={taskValue}
            items={taskItems}
            setOpen={setTaskOpen}
            setValue={setTaskValue}
            setItems={setTaskItems}
            placeholder="Select Task"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
            zIndexInverse={3000}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddContractor}
          >
            <Text style={styles.addButtonText}>+ Add Contractor</Text>
          </TouchableOpacity>

          {assignedContractors.map((contractor, index) => (
            <View key={index} style={styles.assignedContractor}>
              <Text style={styles.contractorInfo}>
                <Text style={styles.boldText}>Contractor Type:</Text>{" "}
                {contractor.contractorTypeLabel}
              </Text>
              <Text style={styles.contractorInfo}>
                <Text style={styles.boldText}>Contractor:</Text>{" "}
                {contractor.contractorLabel}
              </Text>
              <Text style={styles.contractorInfo}>
                <Text style={styles.boldText}>Task:</Text>{" "}
                {contractor.taskLabel}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishProjectSetup}
          >
            <Text style={styles.finishButtonText}>Finish Project Setup</Text>
          </TouchableOpacity>
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
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  dropdown: {
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  finishButton: {
    marginTop: 20,
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#0000FF",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  assignedContractor: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  contractorInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default AssignContractors;
