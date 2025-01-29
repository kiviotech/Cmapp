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
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import CrossPlatformDatePicker from "./CrossPlatformDatePicker";
import {
  fetchStandardTaskBySubcontractor,
  fetchStandardTasks,
} from "../../src/services/standardTaskService";
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
  const [assignedTask, setAsignedTask] = useState([]);
  // const [taskOpen, setTaskOpen] = useState(false);
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
  const [isLoading, setIsLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "" });
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const [jobRole, setJobRole] = useState([]);
  const clearProjectData = useProjectStore((state) => state.clearProjectData);
  const route = useRoute();
  const navigation = useNavigation();
  const { projectId, project_manager, project_supervisor, site_coordinator } =
    route.params || {};

  // Add this new state for search
  const [searchText, setSearchText] = useState("");

  // Add this new ref
  const searchInputRef = React.useRef(null);

  // console.log("projectid", projectId);

  useEffect(() => {
    const loadContractorTypes = async () => {
      try {
        const response = await fetchSubContractors();
        const types = response.data.map((contractor) => ({
          label: contractor.attributes.name,
          value: contractor.id,
        }));
        setContractorTypeItems(types);
        // Store original items in a ref or state if needed for reset
      } catch (error) {
        console.error("Error fetching contractor types:", error);
      }
    };
    loadContractorTypes();
  }, []);

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

  // useEffect(() => {
  const fetchStandardTasks = async (value) => {
    const contractorLabel = contractorTypeItems.find(
      (item) => item.value === value
    )?.label;
    try {
      const response = await fetchStandardTaskBySubcontractor(contractorLabel);
      setAsignedTask(response.data);
      const roles = response?.data
        .map(
          (task) => task.attributes?.project_team?.data?.attributes?.job_role
        )
        .filter((role) => role !== undefined); // Filter out undefined values

      setJobRole(roles);
    } catch (error) {
      console.error("Error fetching standard tasks:", error);
    }
  };
  // }, [contractorTypeItems]);

  useEffect(() => {
    // console.log("Project ID in AssignContractors:", projectId);
    if (!projectId) {
      console.warn("No project ID received in AssignContractors");
    }
  }, [projectId]);

  useEffect(() => {
    const loadProjectDetails = async () => {
      if (!projectId) {
        console.warn("Cannot load project details: No project ID available");
        return;
      }

      try {
        const response = await fetchProjectById(projectId);
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

    loadProjectDetails();
  }, [projectId]);

  const validateField = (fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "contractorType":
        if (!value) error = "Contractor type is required.";
        break;
      case "contractor":
        if (!value) error = "Contractor is required.";
        break;
      case "dueDate":
        if (!value) {
          error = "Due date is required.";
        } else {
          const today = new Date();
          if (new Date(value) < today) {
            error = "Please select a future date.";
          }
        }
        break;
    }
    setValidationErrors((prev) => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const handleAddContractor = async () => {
    if (
      !validateField("contractorType", contractorTypeValue) ||
      !validateField("contractor", contractorValue) ||
      !validateField("dueDate", dueDate)
    ) {
      Alert.alert(
        "Error",
        "Please select all required fields, including Due Date."
      );
      return;
    }

    if (!assignedTask || assignedTask.length === 0) {
      Alert.alert(
        "Error",
        "No tasks are available for the selected contractor type."
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
    setIsFinishButtonEnabled(true); // Enable finish button if a contractor is added
  };

  const showToast = ({ title, message }) => {
    setToastMessage({ title, message });
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2700),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastVisible(false);
    });
  };

  const CustomToast = () => (
    <Animated.View
      style={[
        toastStyles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={toastStyles.content}>
        <Text style={toastStyles.title}>{toastMessage.title}</Text>
        <Text style={toastStyles.message}>{toastMessage.message}</Text>
      </View>
    </Animated.View>
  );

  const handleFinishProjectSetup = async () => {
    if (assignedContractors.length === 0) {
      Alert.alert("Error", "Please add at least one contractor.");
      return;
    }
    setIsLoading(true);
    try {
      const contractorIds = assignedContractors.map(
        (contractor) => contractor.contractor
      );

      // Create tasks and store their IDs
      const taskIds = [];

      for (const contractor of assignedContractors) {
        if (!assignedTask || assignedTask.length === 0) {
          throw new Error("No assigned tasks available for this contractor.");
        }

        for (const task of assignedTask) {
          const taskData = {
            data: {
              project: projectId,
              standard_task: task.id,
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
      }

      if (taskIds.length === 0) {
        throw new Error("No tasks could be created.");
      }

      const projectDetailsById = await fetchProjectById(projectId);

      const existingTaskIds =
        projectDetailsById?.data?.attributes?.tasks?.data.map(
          (task) => task.id
        );
      const existingContractorIds =
        projectDetailsById?.data?.attributes?.contractors?.data.map(
          (contractor) => contractor.id
        );
      const updatedTaskIds = [...existingTaskIds, ...taskIds];
      const updatedContractorIds = [...existingContractorIds, ...contractorIds];

      const projectData = {
        data: {
          contractors: updatedContractorIds,
          tasks: updatedTaskIds,
          project_status: "pending",
        },
      };

      await updateExistingProject(projectId, projectData);
      showToast({
        title: "Success",
        message: "Project setup completed and tasks assigned!",
      });
      setIsLoading(false);
      clearProjectData();
      setAssignedContractors([]);

      // Clear input fields
      setContractorTypeValue(null);
      setContractorValue(null);
      setDueDate(null);
      setContractorItems([]);
    } catch (error) {
      console.error("Error creating tasks or updating project:", error);
      showToast({
        title: "Error",
        message: "There was an issue saving the project assignments.",
      });
    }
  };

  const handleSkip = () => {
    navigation.navigate("(pages)/dashboard");
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

  // Add this function to handle search
  const handleSearch = (text) => {
    setSearchText(text);
    // Filter contractor types based on search text
    const filteredItems = contractorTypeItems.filter((item) =>
      item.label.toLowerCase().includes(text.toLowerCase())
    );
    setContractorTypeItems(filteredItems);
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      {toastVisible && <CustomToast />}
      <ScrollView>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Creating tasks, please wait...</Text>
          </View>
        )}
        {popupVisible && (
          <View style={styles.popup}>
            <Text style={styles.popupText}>Tasks successfully created!</Text>
          </View>
        )}
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
            setOpen={(isOpen) => {
              setContractorTypeOpen(isOpen);
              if (isOpen) {
                setTimeout(() => {
                  searchInputRef.current?.focus();
                }, 100);
              }
            }}
            setValue={(value) => {
              setContractorTypeValue(value);
              setShowTypeError(false);
              validateField("contractorType", value);
            }}
            onChangeValue={fetchStandardTasks}
            setItems={setContractorTypeItems}
            placeholder="Select the contractor type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            searchTextInputStyle={{ borderWidth: 0, outline: "none" }}
            searchTextInputProps={{
              ref: searchInputRef,
            }}
            zIndex={6000}
            zIndexInverse={1000}
            searchable={true}
            searchPlaceholder="Search contractor type..."
            onChangeSearchText={handleSearch}
          />
          {validationErrors.contractorType && (
            <Text style={styles.errorText}>
              {validationErrors.contractorType}
            </Text>
          )}

          <Text style={styles.label}>Contractor</Text>
          {/* <TouchableOpacity onPress={handleContractorPress} activeOpacity={1}> */}
          <DropDownPicker
            open={contractorOpen}
            value={contractorValue}
            items={contractorItems}
            setOpen={setContractorOpen}
            setValue={(value) => {
              setContractorValue(value);
              validateField("contractor", value);
            }}
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

          {/* <Text style={styles.label}>Assign Task</Text>
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
          )} */}

          <Text style={styles.label}>Due Date</Text>
          <View style={styles.datePickerContainer}>
            <CrossPlatformDatePicker
              value={dueDate}
              onChange={(value) => {
                setDueDate(value);
                validateField("dueDate", value);
              }}
              minDate={projectDates.startDate}
              maxDate={projectDates.endDate}
            />
          </View>

          {validationErrors.dueDate && (
            <Text style={styles.errorText}>{validationErrors.dueDate}</Text>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddContractor}
          >
            <Text style={styles.addButtonText}>+ Map Tasks</Text>
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
                <Text style={styles.boldText}>Tasks:</Text>{" "}
                {assignedTask?.map((assigned, idx) => (
                  <Text
                    key={idx} // Add a unique key for each task
                    style={{ marginHorizontal: 5 }}
                  >
                    {assigned.attributes.Name}
                    {","}
                  </Text>
                ))}
              </Text>
              <Text style={styles.contractorInfo}>
                <Text style={styles.boldText}>Due Date:</Text>{" "}
                {contractor.dueDate
                  ? new Date(contractor.dueDate).toLocaleDateString()
                  : "N/A"}
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
              <Text style={styles.finishButtonText}>Assign Tasks</Text>
            </TouchableOpacity>
            {showTooltip && !isFinishButtonEnabled && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>
                  Please add at least one contractor first
                </Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.finishbtn} onPress={handleSkip}>
                <Text style={styles.finishbtn}>Skip for Now</Text>
              </TouchableOpacity>
            </View>
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
  loaderContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  popup: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 10,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  popupText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
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
    marginBottom: 5,
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
    marginVertical: 20,
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
  finishbtn: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
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

const toastStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  content: {
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
});

export default AssignContractors;
