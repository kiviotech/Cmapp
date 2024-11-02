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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CrossPlatformDatePicker from "./CrossPlatformDatePicker";
import { fetchUsers } from "../../src/services/userService";
import { createNewProject } from "../../src/services/projectService";
import FileUpload from "../../components/FileUploading/FileUpload";
import { useNavigation } from "@react-navigation/native";
import useProjectStore from "../../projectStore";

const ProjectForm = () => {
  const navigation = useNavigation();
  const setProjectData = useProjectStore((state) => state.setProjectData);
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
  const [errors, setErrors] = useState({});

  const fileUploadEndpoint = "/upload";

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const projectManagersList = users.filter(
          (user) => user.designation?.Name === "Project Manager"
        );
        setProjectManagers(projectManagersList);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    loadUsers();
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
    // if (!uploadedFiles.length)
    //   newErrors.uploadedFiles = "At least one document is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("files", {
      uri: file.uri,
      name: file.name,
      type: file.type || "image/jpeg",
    });

    try {
      const response = await fetch(fileUploadEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data[0].id;
      } else {
        const errorDetails = await response.text();
        console.error("File upload failed:", errorDetails);
        throw new Error(`File upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleProjectCreation = async () => {
    if (!validate()) return;

    try {
      const documentIds = await Promise.all(
        uploadedFiles.map(async (file) => {
          const documentId = await uploadFileToServer(file);
          return documentId;
        })
      );

      const projectData = {
        data: {
          name: projectName,
          description: projectDescription,
          update_status: "pending",
          start_date: startDate ? startDate.toISOString().split("T")[0] : null,
          deadline: endDate ? endDate.toISOString().split("T")[0] : null,
          user: projectManagerId,
          documents: documentIds,
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
      navigation.navigate("(pages)/AddTasks");
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
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Project</Text>

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

      <CrossPlatformDatePicker
        label="Start Date"
        value={startDate}
        onChange={setStartDate}
      />
      {errors.startDate && (
        <Text style={styles.errorText}>{errors.startDate}</Text>
      )}

      <CrossPlatformDatePicker
        label="Estimated End Date"
        value={endDate}
        onChange={setEndDate}
      />
      {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}

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
    padding: 20,
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1A1A1A",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
  },
  modalTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalCancel: {
    marginTop: 10,
    alignItems: "center",
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    borderStyle: "dashed",
    backgroundColor: "#F8F8F8",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  createButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default ProjectForm;
