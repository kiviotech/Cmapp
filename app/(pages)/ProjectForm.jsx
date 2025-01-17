import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CrossPlatformDatePicker from "./CrossPlatformDatePicker";
import { fetchUsers } from "../../src/services/userService";
import { createNewProject } from "../../src/services/projectService";
import FileUpload from "../../components/FileUploading/FileUpload";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../src/api/apiClient";
import { fetchProjectTeamManager } from "../../src/services/projectTeamService";
import useAuthStore from "../../useAuthStore";
import DropDownPicker from "react-native-dropdown-picker";

const { width, height } = Dimensions.get("window");

const ProjectForm = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const [projectManager, setProjectManager] = useState(null);
  const [projectSupervisors, setProjectSupervisors] = useState(
    "Select Project Supervisors"
  );
  const [siteCoordinators, setSiteCoordinators] = useState(
    "Select Site Coordinators"
  );
  const [projectManagerOpen, setProjectManagerOpen] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState(null); // To track which dropdown is active
  const [selectedUser, setSelectedUser] = useState("");
  const [projectManagerId, setProjectManagerId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectManagers, setProjectManagers] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [documentIds, setDocumentIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [projectData, setProjectData] = useState([]);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [projectManagerItems, setProjectManagerItems] = useState([]);

  const [supervisor, setSupervisor] = useState(null);
  const [supervisorOpen, setSupervisorOpen] = useState(false);
  const [supervisorItems, setSupervisorItems] = useState([]);

  const [coordinator, setCoordinator] = useState(null);
  const [coordinatorOpen, setCoordinatorOpen] = useState(false);
  const [coordinatorItems, setCoordinatorItems] = useState([]);
  const [projectManagerTeamId, setProjectManagerTeamId] = useState('');
  const [projectSupervisorTeamId, setProjectSupervisorTeamId] = useState('');
  const [siteCoordTeamId, setsiteCoordTeamId] = useState('');


  useEffect(() => {
    const loadTeamData = async () => {
      try {
        // Fetch Project Managers
        const managersResponse = await fetchProjectTeamManager(
          "Project Manager"
        );
        setProjectManagerTeamId(managersResponse?.data[0]?.id)
        const managersList = managersResponse.data.flatMap((team) =>
          team.attributes.users.data.map((user) => ({
            label: user.attributes?.username,
            value: user.id,
          }))
        );
        setProjectManagerItems(managersList);

        // Fetch Project Supervisors
        const supervisorsResponse = await fetchProjectTeamManager(
          "Project Supervisor"
        );
        console.log('supervisorsResponse', supervisorsResponse.data)
        setProjectSupervisorTeamId(supervisorsResponse?.data[0]?.id)
        const supervisorsList = supervisorsResponse.data.flatMap((team) =>
          team.attributes.users.data.map((user) => ({
            label: user.attributes?.username,
            value: user.id,
          }))
        );
        setSupervisorItems(supervisorsList);

        // Fetch Site Coordinators
        const coordinatorsResponse = await fetchProjectTeamManager(
          "Site Coordinator"
        );
        setsiteCoordTeamId(coordinatorsResponse?.data[0]?.id)
        const coordinatorsList = coordinatorsResponse.data.flatMap((team) =>
          team.attributes.users.data.map((user) => ({
            label: user.attributes?.username,
            value: user.id,
          }))
        );
        setCoordinatorItems(coordinatorsList);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    loadTeamData();
  }, []);

  const isDateInFuture = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of the day (midnight)
    return date >= today;
  };

  const validateField = (fieldName, value) => {
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${fieldName.charAt(0).toUpperCase() +
          fieldName
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .trim()
          } is required`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const isDuplicateProject = projectData.some(
      (project) =>
        project.name === projectName.toLowerCase() &&
        project.location === projectAddress.toLowerCase()
    );

    if (isDuplicateProject) {
      newErrors.projectName = "Project with this name already exists";
      newErrors.projectAddress = "Project with this location already exists";
    }
    if (!projectName) newErrors.projectName = "Project name is required";
    else if (/^\d+$/.test(projectName)) {
      // This condition checks if the projectName is only numbers
      newErrors.projectName = "Project name cannot be only numbers";
    } else if (!/^[a-zA-Z0-9\s]*$/.test(projectName)) {
      // This regex allows letters, numbers, and spaces
      newErrors.projectName =
        "Project name must be alphanumeric (letters, numbers, or spaces)";
    }
    if (!projectType) newErrors.projectType = "Project type is required";
    if (!projectAddress)
      newErrors.projectAddress = "Project address is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!uploadedFiles) newErrors.uploadedFiles = "Document is required";
    if (!projectManager)
      newErrors.projectManager = "Project manager selection is required";
    if (!supervisor)
      newErrors.supervisor = "Project supervisor selection is required";
    if (!coordinator)
      newErrors.coordinator = "Site coordinator selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProjectCreation = async () => {
    if (!validate()) return;

    try {
      const formattedStartDate = startDate
        ? startDate.toISOString().slice(0, 10)
        : null;
      const formattedEndDate = endDate
        ? endDate.toISOString().slice(0, 10)
        : null;
      console.log(documentIds.flat());

      const projectData = {
        data: {
          name: projectName,
          description: projectDescription,
          end_date: formattedEndDate,
          start_date: formattedStartDate,
          project_type: projectType,
          location: projectAddress,
          approvers: [projectSupervisorTeamId, projectManagerTeamId, siteCoordTeamId],
          project_manager: projectManager,
          project_supervisor: supervisor,
          site_coordinator: coordinator,
          project_status: "ongoing",
          documents: documentIds.flat(),
        },
      };

      const response = await createNewProject(projectData);

      if (response?.data) {
        setProjectData(response.data);
        setIsSuccessModalVisible(true);
        resetForm();
      } else {
        console.error("Error details:", response.error);
        Alert.alert(
          "Error",
          response.error?.message || "Failed to create project."
        );
      }
      if (response?.data) {
        setProjectData(response.data);
        Alert.alert("Success", "Project created successfully!");
        resetForm();
        navigation.navigate("(pages)/AssignProjectTeam", {
          projectId: response.data.id, // Pass only the id
          project_manager: projectManager,
          project_supervisor: supervisor,
          site_coordinator: coordinator,
        });
      } else {
        console.error("Error details:", response.error);
        Alert.alert(
          "Error",
          response.error?.message || "Failed to create project."
        );
      }
    } catch (error) {
      console.error("Error creating project:", error);
      Alert.alert("Error", "An error occurred while creating the project.");
    }
  };

  const resetForm = () => {
    setProjectName("");
    setProjectType("");
    setProjectAddress("");
    setStartDate(null);
    setEndDate(null);
    setProjectManager("Select Project Manager");
    setProjectManagerId(null);
    setProjectDescription("");
    setUploadedFiles([]);
    setDocumentIds([]);
  };

  const handleFileUploadSuccess = (id) => {
    console.log("File uploaded with ID:", id);
    setDocumentIds((prevIds) => [...prevIds, id]);
  };

  const closeModal = () => {
    setIsSuccessModalVisible(false);
    navigation.navigate("(pages)/AssignContractors", {
      projectId: projectData.id,
    });
  };

  const handleProjectNameChange = (text) => {
    const sanitizedText = text.replace(/[^a-zA-Z0-9\s-]/g, "");
    setProjectName(sanitizedText);
    validateField("projectName", sanitizedText);
  };

  const handleProjectTypeChange = (text) => {
    const sanitizedText = text.replace(/[^a-zA-Z0-9\s-]/g, "");
    setProjectType(sanitizedText);
    validateField("projectType", sanitizedText);
  };

  const handleProjectAddressChange = (text) => {
    const sanitizedText = text.replace(/[^a-zA-Z0-9\s,.-]/g, "");
    setProjectAddress(sanitizedText);
    validateField("projectAddress", sanitizedText);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    validateField("startDate", date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    validateField("endDate", date);
  };

  const handleProjectManagerSelection = (username, id) => {
    setProjectManager(username);
    setProjectManagerId(id);
    validateField("projectManagerId", id);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.fixedHeader}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>New Project</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Enter project name</Text>
            <TextInput
              placeholder="Enter project name"
              placeholderTextColor="#B0B0B0"
              style={styles.input}
              value={projectName}
              onChangeText={handleProjectNameChange}
            />
            {errors.projectName && (
              <Text style={styles.errorText}>{errors.projectName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Enter project type</Text>
            <TextInput
              placeholder="Example: 'Commercial'"
              placeholderTextColor="#B0B0B0"
              style={styles.input}
              value={projectType}
              onChangeText={handleProjectTypeChange}
            />
            {errors.projectType && (
              <Text style={styles.errorText}>{errors.projectType}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Enter project location</Text>
            <TextInput
              placeholder="Ex: 1234 Riverside Avenue, Springfield"
              placeholderTextColor="#B0B0B0"
              style={styles.input}
              value={projectAddress}
              onChangeText={handleProjectAddressChange}
            />
            {errors.projectAddress && (
              <Text style={styles.errorText}>{errors.projectAddress}</Text>
            )}
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateWrapper}>
              <CrossPlatformDatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                minDate={startDate || new Date()}
              />
              {errors.startDate && (
                <Text style={styles.errorText}>{errors.startDate}</Text>
              )}
            </View>

            <View style={styles.dateWrapper}>
              <CrossPlatformDatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                minDate={startDate || new Date()}
              />
              {errors.endDate && (
                <Text style={styles.errorText}>{errors.endDate}</Text>
              )}
            </View>
          </View>

          <View style={[styles.inputContainer, { zIndex: 3000 }]}>
            <Text style={styles.labelText}>Select Project Supervisor</Text>
            <DropDownPicker
              open={supervisorOpen}
              value={supervisor}
              items={supervisorItems}
              setOpen={setSupervisorOpen}
              setValue={setSupervisor}
              setItems={setSupervisorItems}
              placeholder="Select Project Supervisor"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
            />
            {errors.supervisor && (
              <Text style={styles.errorText}>{errors.supervisor}</Text>
            )}
          </View>

          <View style={[styles.inputContainer, { zIndex: 2000 }]}>
            <Text style={styles.labelText}>Select Project Manager</Text>
            <DropDownPicker
              open={projectManagerOpen}
              value={projectManager}
              items={projectManagerItems}
              setOpen={setProjectManagerOpen}
              setValue={setProjectManager}
              setItems={setProjectManagerItems}
              placeholder="Select Project Manager"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={2000}
            />
            {errors.projectManager && (
              <Text style={styles.errorText}>{errors.projectManager}</Text>
            )}
          </View>

          <View style={[styles.inputContainer, { zIndex: 1000 }]}>
            <Text style={styles.labelText}>Select Site Coordinator</Text>
            <DropDownPicker
              open={coordinatorOpen}
              value={coordinator}
              items={coordinatorItems}
              setOpen={setCoordinatorOpen}
              setValue={setCoordinator}
              setItems={setCoordinatorItems}
              placeholder="Select Site Coordinator"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1000}
              zIndexInverse={3000}
            />
            {errors.coordinator && (
              <Text style={styles.errorText}>{errors.coordinator}</Text>
            )}
          </View>
          <Modal
            visible={dropdownVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  {selectedDropdown === "manager"
                    ? "Select Project Manager"
                    : selectedDropdown === "supervisor"
                      ? "Select Project Supervisor"
                      : "Select Site Coordinator"}
                </Text>
                <FlatList
                  data={
                    selectedDropdown === "manager"
                      ? projectManagers
                      : selectedDropdown === "supervisor"
                        ? projectSupervisors
                        : siteCoordinators
                  }
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedUser(item.username);
                        setDropdownVisible(false);
                        // Handle specific selection if needed
                        console.log(
                          `Selected ${selectedDropdown}:`,
                          item.username
                        );
                      }}
                      style={styles.modalItem}
                    >
                      <Text style={{ color: "#333333" }}>{item.username}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setDropdownVisible(false)}
                  style={styles.modalCancel}
                >
                  <Text style={{ color: "#4a90e2" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.uploadContainer}>
            <FileUpload
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              onFileUploadSuccess={handleFileUploadSuccess}
              message="Upload Project Documents in .png or .jpeg format"
            />
          </View>
          {errors.uploadedFiles && (
            <Text style={styles.errorText}>{errors.uploadedFiles}</Text>
          )}

          <TextInput
            placeholder="Project description..."
            placeholderTextColor="#B0B0B0"
            multiline
            style={styles.textArea}
            value={projectDescription}
            onChangeText={(text) => setProjectDescription(text)}
          />

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleProjectCreation}
          >
            <Text style={styles.createButtonText}>Create Project</Text>
          </TouchableOpacity>
          <Modal
            visible={dropdownVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  {selectedDropdown === "manager"
                    ? "Select Project Manager"
                    : selectedDropdown === "supervisor"
                      ? "Select Project Supervisor"
                      : "Select Site Coordinator"}
                </Text>
                <FlatList
                  data={
                    selectedDropdown === "manager"
                      ? projectManagers
                      : selectedDropdown === "supervisor"
                        ? projectSupervisors
                        : siteCoordinators
                  }
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedDropdown === "manager") {
                          setProjectManager(item.username);
                        } else if (selectedDropdown === "supervisor") {
                          setProjectSupervisors(item.username);
                        } else if (selectedDropdown === "coordinator") {
                          setSiteCoordinators(item.username);
                        }
                        setDropdownVisible(false);
                        console.log(
                          `Selected ${selectedDropdown}:`,
                          item.username
                        );
                      }}
                      style={styles.modalItem}
                    >
                      <Text style={{ color: "#333333" }}>{item.username}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setDropdownVisible(false)}
                  style={styles.modalCancel}
                >
                  <Text style={{ color: "#4a90e2" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  fixedHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.05,
    paddingTop: width * 0.1,
    backgroundColor: "#F8F8F8",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  container: {
    flex: 1,
    marginTop: width * 0.2, // Add margin to account for fixed header
  },
  contentContainer: {
    padding: width * 0.05,
    paddingBottom: height * 0.1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "600",
    marginBottom: height * 0.02,
    color: "#1A1A1A",
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
  inputContainer: {
    marginBottom: 20,
  },
  labelText: {
    fontSize: 17,
    paddingBottom: 10,
  },
  dropdown: {
    marginBottom: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: height * 0.015,
    marginBottom: height * 0.015,
    backgroundColor: "#FFFFFF",
    fontSize: width * 0.04,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.015,
    gap: 35,
    marginRight: width * 0.03,
  },
  dateWrapper: {
    width: "43%",
    marginRight: width * 0.02,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: height * 0.015,
    marginBottom: height * 0.015,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: width * 0.05,
  },
  modalTitle: {
    fontWeight: "600",
    fontSize: width * 0.05,
    marginBottom: height * 0.01,
  },
  modalItem: {
    padding: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalCancel: {
    marginTop: height * 0.015,
    alignItems: "center",
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: height * 0.015,
    alignItems: "center",
    marginBottom: height * 0.015,
    borderStyle: "dashed",
    backgroundColor: "#F8F8F8",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: height * 0.015,
    height: height * 0.15,
    textAlignVertical: "top",
    marginBottom: height * 0.02,
    backgroundColor: "#FFFFFF",
    fontSize: width * 0.04,
  },
  createButton: {
    backgroundColor: "#4a90e2",
    padding: height * 0.02,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: height * 0.1,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  errorText: {
    color: "red",
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
  },
  proceedButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  proceedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProjectForm;