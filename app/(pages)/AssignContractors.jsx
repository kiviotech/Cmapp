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
  updateTask,
  createProjectAssignment,
} from "../../src/services/projectService";
import useProjectStore from "../../projectStore";
import { useRoute } from "@react-navigation/native";

const AssignContractors = () => {
  const [projectName, setProjectName] = useState("");
  const [contractorTypeOpen, setContractorTypeOpen] = useState(false);
  const [contractorTypeValue, setContractorTypeValue] = useState(null);
  const [contractorTypeItems, setContractorTypeItems] = useState([]);

  const [contractorOpen, setContractorOpen] = useState(false);
  const [contractorValue, setContractorValue] = useState(null);
  const [contractorItems, setContractorItems] = useState([]);

  const [taskOpen, setTaskOpen] = useState(false);
  const [taskValue, setTaskValue] = useState(null);
  const [taskItems, setTaskItems] = useState([]);

  const route = useRoute();
  const projectData =
    route.params?.projectData || useProjectStore((state) => state.projectData);

  useEffect(() => {
    const loadProjectDetails = async () => {
      if (projectData?.id) {
        try {
          const response = await fetchProjectById(projectData.id);
          const projectDetails = response.data;

          setProjectName(projectDetails.attributes.name);

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
        const contractors = response.data ? response.data : response;

        if (!Array.isArray(contractors)) {
          console.error("Unexpected format: contractors is not an array");
          return;
        }

        const types = [
          ...new Set(
            contractors.map((contractor) => contractor.attributes.name)
          ),
        ].map((type, index) => ({
          label: type,
          value: type.toLowerCase(),
          key: `type-${index}`,
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

  const handleFinishProjectSetup = async () => {
    if (!contractorTypeValue || !contractorValue || !taskValue) {
      Alert.alert("Error", "Please select all required fields.");
      return;
    }

    const assignmentData = {
      project_name: projectName,
      assigned_to: contractorValue,
      sub_contractor: contractorTypeValue,
      task_id: taskValue,
    };

    // Create project assignment
    try {
      await createProjectAssignment(assignmentData); // Call the function to create a project assignment
      await updateTask(taskValue, {
        assigned_to: contractorValue,
        sub_contractor: contractorTypeValue,
      });
      console.log("Project assignment data submitted:", assignmentData);
      Alert.alert("Success", "Project setup completed and task updated!");
    } catch (error) {
      console.error("Error updating task or creating assignment:", error);
      Alert.alert("Error", "There was an issue saving the project assignment.");
    }
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.mainHeading}>Assign Contractors</Text>

          <Text style={styles.projectName}>Project Name: {projectName}</Text>

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
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
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
    margin: "auto",
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
});

export default AssignContractors;
