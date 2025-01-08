import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import CrossPlatformDatePicker from "./CrossPlatformDatePicker";
import { fetchStandardTasks } from "../../src/services/standardTaskService";
import { fetchSubContractors } from "../../src/services/subContractorService";
import {
  fetchProjectById,
  updateExistingProject,
} from "../../src/services/projectService";
import { createTask } from "../../src/services/taskService";
import { fetchContractors } from "../../src/services/contractorService";
import { useRoute, useNavigation } from "@react-navigation/native";
import useProjectStore from "../../projectStore";

const { width, height } = Dimensions.get("window");

const AssignContractors = () => {
  const [contractorTypeOpen, setContractorTypeOpen] = useState(false);
  const [contractorTypeValue, setContractorTypeValue] = useState(null);
  const [contractorTypeItems, setContractorTypeItems] = useState([]);
  const [contractorOpen, setContractorOpen] = useState(false);
  const [contractorValue, setContractorValue] = useState(null);
  const [contractorItems, setContractorItems] = useState([]);
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskValue, setTaskValue] = useState(null);
  const [taskItems, setTaskItems] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [assignedContractors, setAssignedContractors] = useState([]);
  const [createdTaskIds, setCreatedTaskIds] = useState([]);
  const [isFinishButtonEnabled, setIsFinishButtonEnabled] = useState(false);
  const [projectDates, setProjectDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTypeError, setShowTypeError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    contractorType: "",
    contractor: "",
    task: "",
    dueDate: "",
  });

  const clearProjectData = useProjectStore((state) => state.clearProjectData);

  const route = useRoute();
  const navigation = useNavigation();
  const projectDataId = route.params?.projectId;

  useEffect(() => {
    console.log("Received project ID:", projectDataId);
  }, [projectDataId]);

  useEffect(() => {
    const loadContractorTypes = async () => {
      try {
        const response = await fetchSubContractors();
        const types = response.data.map((contractor) => ({
          label: contractor.attributes.name,
          value: contractor.id,
        }));
        setContractorTypeItems(types);
      } catch (error) {
        console.error("Error fetching contractor types:", error);
      }
    };
    loadContractorTypes();
  }, []);

  // useEffect(() => {
  //   const loadContractors = async () => {
  //     try {
  //       const response = await fetchContractors();
  //       const contractors = response.data.map((contractor) => ({
  //         label: contractor.attributes.username,
  //         value: contractor.id,
  //         sub_contractor:
  //           contractor.attributes.sub_contractor?.data?.attributes?.name ||
  //           "No Sub Contractor",
  //       }));
  //       setContractorItems(contractors);
  //     } catch (error) {
  //       console.error("Error fetching contractors:", error);
  //     }
  //   };
  //   loadContractors();
  // }, []);

  useEffect(() => {
    const loadContractors = async () => {
      try {
        const response = await fetchContractors();
        const contractors = response.data
          .filter(
            (contractor) =>
              contractor.attributes.sub_contractor?.data?.id ===
              contractorTypeValue
          ) // Filter based on contractorTypeValue
          .map((contractor) => ({
            label: contractor.attributes.username,
            value: contractor.id,
            sub_contractor:
              contractor.attributes.sub_contractor?.data?.attributes?.name ||
              "No Sub Contractor",
          }));
        setContractorItems(contractors);
      } catch (error) {
        console.error("Error fetching contractors:", error);
      }
    };
    if (contractorTypeValue) {
      loadContractors();
    } else {
      setContractorItems([]); // Clear contractors if no type is selected
    }
  }, [contractorTypeValue]);

  useEffect(() => {
    const loadStandardTasks = async () => {
      try {
        const response = await fetchStandardTasks();
        const tasks = response.data.map((task) => ({
          label: task.attributes.Name,
          value: task.id,
        }));
        setTaskItems(tasks);
      } catch (error) {
        console.error("Error fetching standard tasks:", error);
      }
    };
    loadStandardTasks();
  }, []);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const response = await fetchProjectById(projectDataId);
        if (response?.data) {
          setProjectDates({
            startDate: new Date(response.data.attributes.start_date),
            endDate: new Date(response.data.attributes.end_date),
          });
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    if (projectDataId) {
      loadProjectDetails();
    }
  }, [projectDataId]);

  
  const validateFields = () => {
    let errors = {};
    if (!contractorTypeValue) {
      errors.contractorType = "Contractor type is required.";
    }
    if (!contractorValue) {
      errors.contractor = "Contractor is required.";
    }
    if (!taskValue) {
      errors.task = "Task is required.";
    }
    if (!dueDate) {
      errors.dueDate = "Due date is required.";
    } else {
      const today = new Date();
      if (new Date(dueDate) < today) {
        errors.dueDate = "Please select a future date.";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddContractor = () => {
    if (!validateFields()) {
      Alert.alert(
        "Error",
        "Please select all required fields, including Due Date."
      );
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
      dueDate: dueDate,
      contractorTypeLabel,
      contractorLabel,
      taskLabel,
    };

    setAssignedContractors([...assignedContractors, newContractor]);
    setIsFinishButtonEnabled(true);
    setContractorTypeValue(null);
    setContractorValue(null);
    setTaskValue(null);
    setDueDate(null);
  };

  const handleFinishProjectSetup = async () => {
    if (assignedContractors.length === 0) {
      Alert.alert("Error", "Please add at least one contractor.");
      return;
    }

    try {
      const contractorIds = assignedContractors.map(
        (contractor) => contractor.contractor
      );

      // Create tasks and store their IDs
      const taskIds = [];
      for (const contractor of assignedContractors) {
        const taskData = {
          data: {
            project: projectDataId,
            standard_task: contractor.task,
            submissions: [],
            contractor: contractor.contractor,
            documents: [],
            task_status: "ongoing",
            due_date: contractor.dueDate.toISOString().slice(0, 10),
          },
        };
        const taskResponse = await createTask(taskData);
        if (taskResponse?.data?.id) {
          taskIds.push(taskResponse.data.id);
        }
      }

      if (taskIds.length !== assignedContractors.length) {
        throw new Error("Some tasks could not be created.");
      }

      const projectData = {
        data: {
          contractors: contractorIds,
          tasks: taskIds,
          project_status: "pending",
        },
      };

      await updateExistingProject(projectDataId, projectData);

      Alert.alert("Success", "Project setup completed and tasks assigned!");
      clearProjectData();
      navigation.navigate("(pages)/dashboard");
    } catch (error) {
      console.error("Error creating tasks or updating project:", error);
      Alert.alert(
        "Error",
        "There was an issue saving the project assignments."
      );
    }
  };

  const handleDisabledButtonPress = () => {
    if (!isFinishButtonEnabled) {
      if (Platform.OS === "web") {
        setShowTooltip(true);
      } else {
        Alert.alert(
          "Action Required",
          "Please add at least one contractor first"
        );
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isFinishButtonEnabled) {
      Alert.alert(
        "Action Required",
        "Please add at least one contractor first"
      );
    }
  };

  const handleContractorPress = () => {
    if (!contractorTypeValue) {
      setShowTypeError(true);
    }
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            {/* <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => navigation.goBack()}
            /> */}
            <Text style={styles.headerText}>Assign Contractors</Text>
          </View>

          <Text style={styles.label}>Contractor Type</Text>
          <DropDownPicker
            open={contractorTypeOpen}
            value={contractorTypeValue}
            items={contractorTypeItems}
            setOpen={setContractorTypeOpen}
            setValue={(value) => {
              setContractorTypeValue(value);
              setShowTypeError(false);
            }}
            setItems={setContractorTypeItems}
            placeholder="Select the contractor type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={6000}
            zIndexInverse={1000}
          />
           {validationErrors.contractorType && (
            <Text style={styles.errorText}>{validationErrors.contractorType}</Text>
          )}

          <Text style={styles.label}>Contractor</Text>
          {/* <TouchableOpacity onPress={handleContractorPress} activeOpacity={1}> */}
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
              zIndex={4000}
              zIndexInverse={1000}
            />
          {/* </TouchableOpacity> */}
          {validationErrors.contractor && (
            <Text style={styles.errorText}>{validationErrors.contractor}</Text>
          )}

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
            zIndex={2000}
            zIndexInverse={3000}
          />
            {validationErrors.task && (
            <Text style={styles.errorText}>{validationErrors.task}</Text>
          )}

          <Text style={styles.label}>Due Date</Text>
          <View style={styles.datePickerContainer}>
            <CrossPlatformDatePicker
              value={dueDate}
              onChange={setDueDate}
              minDate={projectDates.startDate}
              maxDate={projectDates.endDate}
            />
          </View>

          {validationErrors.dueDate && (
        <Text style={styles.errorText}>
          {validationErrors.dueDate}
        </Text>
          )}

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
              <Text style={styles.contractorInfo}>
                <Text style={styles.boldText}>Due Date:</Text>{" "}
                {contractor.dueDate?.toLocaleDateString()}
              </Text>
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.finishButton,
                !isFinishButtonEnabled && styles.finishButtonDisabled,
              ]}
              onPress={handleFinishProjectSetup}
              onPressIn={
                Platform.OS !== "web" ? handleDisabledButtonPress : undefined
              }
              onMouseEnter={() =>
                !isFinishButtonEnabled && setShowTooltip(true)
              }
              onMouseLeave={() => setShowTooltip(false)}
              disabled={!isFinishButtonEnabled}
            >
              <Text style={styles.finishButtonText}>Finish Project Setup</Text>
            </TouchableOpacity>
            {showTooltip && !isFinishButtonEnabled && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>
                  Please add at least one contractor first
                </Text>
              </View>
            )}
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
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 20,
    marginTop: -5,
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
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    cursor: "pointer",
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
  datePickerContainer: {
    marginRight: 20,
    marginBottom: 15,
  },
  finishButtonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
    cursor: "not-allowed",
  },
  buttonContainer: {
    position: "relative",
    alignItems: "center",
    marginTop: 20,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    borderRadius: 5,
    top: -45,
    zIndex: 1000,
  },
  tooltipText: {
    color: "white",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default AssignContractors;