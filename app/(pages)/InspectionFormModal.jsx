import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchProjectWithTaskDetails } from "../../src/services/projectService";
import { useNavigation } from "@react-navigation/native";

const InspectionFormModal = ({ visible, onClose, projectId }) => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [subcategoryMap, setSubcategoryMap] = useState(new Map());

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const projectData = await fetchProjectWithTaskDetails(projectId);
        const tasks = projectData?.data?.attributes?.tasks?.data || [];

        // Create Maps to store categories and their related subcategories
        const categorySet = new Set();
        const newSubcategoryMap = new Map();

        tasks.forEach((task) => {
          const standardTask =
            task?.attributes?.standard_task?.data?.attributes;
          if (!standardTask) return;

          const subcategory = standardTask?.subcategory?.data?.attributes;
          if (!subcategory) return;

          const category = subcategory?.category?.data?.attributes;
          if (!category) return;

          if (category.name) {
            categorySet.add(category.name);

            // Store subcategories with their parent category
            if (subcategory.name) {
              if (!newSubcategoryMap.has(category.name)) {
                newSubcategoryMap.set(category.name, new Set());
              }
              newSubcategoryMap.get(category.name).add(subcategory.name);
            }
          }
        });

        const uniqueCategories = Array.from(categorySet);
        setCategories(uniqueCategories);
        setSubcategoryMap(newSubcategoryMap); // Store the subcategory map

        // Update subcategories when category is selected
        if (selectedCategory) {
          const subcategoriesForCategory = Array.from(
            newSubcategoryMap.get(selectedCategory) || []
          );
          setSubCategories(subcategoriesForCategory);
        }

        console.log("Categories loaded:", uniqueCategories);
        console.log("Subcategory map:", Object.fromEntries(newSubcategoryMap));
      } catch (error) {
        console.error("Error fetching project task details:", error);
      }
    };

    if (visible && projectId) {
      fetchTaskDetails();
    }
  }, [visible, projectId]); // Remove selectedCategory from dependencies

  // Separate useEffect for handling category selection
  useEffect(() => {
    if (selectedCategory && subcategoryMap) {
      const subcategoriesForCategory = Array.from(
        subcategoryMap.get(selectedCategory) || []
      );
      setSubCategories(subcategoriesForCategory);
      setSelectedSubCategory(""); // Also reset subcategory when category changes
    }
  }, [selectedCategory, subcategoryMap]);

  const handleCategorySelect = (category) => {
    console.log("Selected Category:", category);
    setSelectedCategory(category);
    setSelectedSubCategory(""); // Reset subcategory when category changes
    setShowCategoryDropdown(false);
  };

  const handleSubCategorySelect = (subCategory) => {
    console.log("Selected SubCategory:", subCategory);
    setSelectedSubCategory(subCategory);
    setShowSubCategoryDropdown(false);
  };

  // Add this function to close dropdowns when clicking outside
  const handleOutsideClick = () => {
    setShowCategoryDropdown(false);
    setShowSubCategoryDropdown(false);
    onClose(); // Close the modal after navigation
  };

  const handleOpenForm = () => {
    if (selectedCategory && selectedSubCategory) {
      console.log("Opening form with:", {
        projectId,
        selectedCategory,
        selectedSubCategory,
      });
      navigation.navigate("(pages)/InspectionForm", {
        // Updated navigation path
        projectId,
        selectedCategory,
        selectedSubCategory,
      });
      onClose(); // Close the modal after navigation
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleOutsideClick}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Inspection Form</Text>

          <View
            style={[styles.dropdownWrapper, styles.categoryDropdownWrapper]}
          >
            <TouchableOpacity
              style={styles.selectButton}
              onPress={(e) => {
                e.stopPropagation();
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowSubCategoryDropdown(false);
              }}
            >
              <Text style={styles.selectButtonText}>
                {selectedCategory || "Select Category"}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#666" />
            </TouchableOpacity>

            {showCategoryDropdown && categories.length > 0 && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.dropdownScroll}>
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(category);
                      }}
                    >
                      <Text style={styles.dropdownText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={(e) => {
                e.stopPropagation();
                setShowSubCategoryDropdown(!showSubCategoryDropdown);
                setShowCategoryDropdown(false);
              }}
            >
              <Text style={styles.selectButtonText}>
                {selectedSubCategory || "Select Sub-category"}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#666" />
            </TouchableOpacity>

            {showSubCategoryDropdown && subCategories.length > 0 && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.dropdownScroll}>
                  {subCategories.map((subCategory, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleSubCategorySelect(subCategory);
                      }}
                    >
                      <Text style={styles.dropdownText}>{subCategory}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.openFormButton,
              (!selectedCategory || !selectedSubCategory) &&
                styles.disabledButton,
            ]}
            onPress={handleOpenForm}
            disabled={!selectedCategory || !selectedSubCategory}
          >
            <Text style={styles.openFormButtonText}>Open Form</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
    position: "relative",
    zIndex: 1000,
  },
  closeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 1001,
    padding: 4,
  },
  dropdownWrapper: {
    marginBottom: 16,
    position: "relative",
    zIndex: 2000,
  },
  categoryDropdownWrapper: {
    marginBottom: 16,
    position: "relative",
    zIndex: 3000,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    zIndex: 3000,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#666",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  openFormButton: {
    backgroundColor: "#577CFF",
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
  disabledButton: {
    opacity: 0.5,
  },
});

export default InspectionFormModal;
