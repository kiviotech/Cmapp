import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchProjectWithTaskDetails } from "../../src/services/projectService";

const InspectionFormModal = ({ visible, onClose, onOpenForm, projectId }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const projectData = await fetchProjectWithTaskDetails(projectId);
        const tasks = projectData?.data?.attributes?.tasks?.data || [];
        tasks.forEach((task) => {
          const subcategoryName =
            task?.attributes?.standard_task?.data?.attributes?.subcategory?.data
              ?.attributes?.name;
          console.log("Subcategory Name:", subcategoryName);
        });
        console.log("Project task details:", data);
      } catch (error) {
        console.error("Error fetching project task details:", error);
      }
    };

    if (visible && projectId) {
      fetchTaskDetails();
    }
  }, [visible, projectId]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Inspection Form</Text>

          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>
              {selectedCategory || "Select Category"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>
              {selectedSubCategory || "Select Sub-category"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.openFormButton} onPress={onOpenForm}>
            <Text style={styles.openFormButtonText}>Open Form</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#192252",
    marginBottom: 20,
    textAlign: "center",
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectButtonText: {
    fontSize: 16,
    color: "#666",
  },
  openFormButton: {
    backgroundColor: "#66B8FC",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  openFormButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default InspectionFormModal;
