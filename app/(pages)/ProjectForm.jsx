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

const { width, height } = Dimensions.get("window");

const ProjectForm = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const [projectManager, setProjectManager] = useState(
    "Select Project Manager"
  );
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

  useEffect(() => {
    const loadProjectManagers = async () => {
      try {
        const response = await fetchProjectTeamManager();
        const managersList = response.data.flatMap((team) =>
          team.attributes.users.data.map((user) => ({
            id: team.id,
            username: user.attributes.username,
          }))
        );
        setProjectManagers(managersList);
      } catch (error) {
        console.error("Error fetching project managers:", error);
      }
    };

    loadProjectManagers();
  }, []);
  const validate = () => {
    const newErrors = {};
    if (!projectName) newErrors.projectName = "Project name is required";
    if (!projectType) newErrors.projectType = "Project type is required";
    if (!projectAddress)
      newErrors.projectAddress = "Project address is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!projectManagerId)
      newErrors.projectManagerId = "Project manager selection is required";
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
          approver: projectManagerId,
          project_status: "ongoing",
          documents: documentIds.flat(),
        },
      };

      const response = await createNewProject(projectData);

      if (response?.data) {
        setProjectData(response.data);
        Alert.alert("Success", "Project created successfully!");
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
        navigation.navigate("(pages)/AssignContractors", {
          projectId: response.data.id, // Pass only the id
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>New Project</Text>
      </View>

      <TextInput
        placeholder="Enter project name"
        placeholderTextColor="#B0B0B0"
        style={styles.input}
        value={projectName}
        onChangeText={(text) => setProjectName(text)}
      />
      {errors.projectName && (
        <Text style={styles.errorText}>{errors.projectName}</Text>
      )}

      <TextInput
        placeholder="Example: 'Commercial'"
        placeholderTextColor="#B0B0B0"
        style={styles.input}
        value={projectType}
        onChangeText={(text) => setProjectType(text)}
      />
      {errors.projectType && (
        <Text style={styles.errorText}>{errors.projectType}</Text>
      )}

      <TextInput
        placeholder="Ex: 1234 Riverside Avenue, Springfield"
        placeholderTextColor="#B0B0B0"
        style={styles.input}
        value={projectAddress}
        onChangeText={(text) => setProjectAddress(text)}
      />
      {errors.projectAddress && (
        <Text style={styles.errorText}>{errors.projectAddress}</Text>
      )}

      <View style={styles.dateContainer}>
        <View style={styles.dateWrapper}>
          <CrossPlatformDatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />
          {errors.startDate && (
            <Text style={styles.errorText}>{errors.startDate}</Text>
          )}
        </View>

        <View style={styles.dateWrapper}>
          <CrossPlatformDatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
          />
          {errors.endDate && (
            <Text style={styles.errorText}>{errors.endDate}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setDropdownVisible(true)}
        style={styles.dropdownButton}
      >
        <Text
          style={{
            color:
              projectManager === "Select Project Manager" ? "#B0B0B0" : "#333",
          }}
        >
          {projectManager}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#B0B0B0" />
      </TouchableOpacity>
      {errors.projectManagerId && (
        <Text style={styles.errorText}>{errors.projectManagerId}</Text>
      )}

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Project Manager</Text>
            <FlatList
              data={projectManagers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setProjectManager(item.username);
                    setProjectManagerId(item.id);
                    setDropdownVisible(false);
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
        />
        {errors.uploadedFiles && (
          <Text style={styles.errorText}>{errors.uploadedFiles}</Text>
        )}
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    paddingTop: width * 0.1,
    backgroundColor: "#F8F8F8",
  },
  scrollContent: {
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
  },
  dateWrapper: {
    width: "48%",
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
});

export default ProjectForm;
