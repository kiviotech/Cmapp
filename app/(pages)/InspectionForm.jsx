import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import fonts from "../../constants/fonts";
import { useRoute, useNavigation } from "@react-navigation/native";
import { fetchProjectInspectionsByProjectId } from "../../src/services/projectInspectionService";
import {
  createNewInspectionForm,
  updateExistingInspectionForm,
  deleteExistingInspectionForm,
} from "../../src/services/inspectionResponseService";
import FileUpload from "../../components/FileUploading/FileUpload";

const InspectionForm = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { projectId, selectedCategory, selectedSubCategory } =
    route.params || {};

  const [checklistItems, setChecklistItems] = useState([]);
  const [projectInspId, setProjectInspId] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "" });
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const inspections = await fetchProjectInspectionsByProjectId(
          projectId,
          selectedSubCategory
        );

        setProjectInspId(inspections?.data[0]?.id)
  
        const formData =
          inspections.data[0]?.attributes?.standard_inspection_form?.data
            ?.attributes;
  
        const responseData =
          inspections.data[0]?.attributes?.inspection_responses?.data;
  
        // Extract checklist items from all sections
        const items =
          formData?.inspection_sections?.data?.flatMap((section) =>
            section.attributes?.checklist_items?.data.map((item) => ({
              id: item.id,
              description: item?.attributes?.description,
              required: item?.attributes?.required,
            }))
          ) || [];
  
        // Check if the checklist item's ID exists in the responses
        const checkedState = {};
        items.forEach((item) => {
          const response = responseData?.find(
            (responseItem) =>
              responseItem.attributes?.checklist_item?.data?.id === item.id
          );
  
          // If no response exists for the checklist item, mark it as checked
          checkedState[item.id] = response ? true : false;
        });
  
        setChecklistItems(items);
  
        setCheckedItems(checkedState);
  
        // Update the `isAllChecked` state
        setIsAllChecked(
          items.length > 0 && items.every((item) => checkedState[item.id])
        );
      } catch (error) {
        console.error("Error fetching inspections:", error);
      }
    };
  
    if (projectId && selectedSubCategory) {
      fetchInspections();
    }
  }, [projectId, selectedCategory, selectedSubCategory]);
  

  const toggleCheckbox = async (id) => {
    // Find the item to check if it's required
    const item = checklistItems.find((item) => item.id === id);
    if (item?.required) {
      return; // Don't allow toggling of required items
    }

    const newCheckedState = !checkedItems[id];

    try {
      if (!newCheckedState && item.inspection_response?.data?.id) {
        // If unchecking and there's an existing response, delete it
        await deleteExistingInspectionForm(item.inspection_response.data.id);

        // Update the item to remove the inspection_response
        const updatedItems = checklistItems.map((checkItem) =>
          checkItem.id === id
            ? { ...checkItem, inspection_response: null }
            : checkItem
        );
        setChecklistItems(updatedItems);
      }

      const newCheckedItems = {
        ...checkedItems,
        [id]: newCheckedState,
      };
      setCheckedItems(newCheckedItems);
      setIsAllChecked(Object.values(newCheckedItems).every((item) => item));
    } catch (error) {
      console.error("Error toggling checkbox:", error);
      showToast({
        title: "Error",
        message: "Failed to update inspection response",
      });
    }
  };

  const handleCheckAll = () => {
    const newCheckedState = !isAllChecked;
    const newCheckedItems = {};
    checklistItems.forEach((item) => {
      // Keep required items checked, toggle others
      newCheckedItems[item.id] = item.required ? true : newCheckedState;
    });
    setCheckedItems(newCheckedItems);
    setIsAllChecked(newCheckedState);
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

  const handleSubmit = async () => {
    try {
      const submitPromises = checklistItems.map(async (item) => {
        const isCurrentlyChecked = checkedItems[item.id];
        const existingResponseId = item.inspection_response?.data?.id;

        // If item is unchecked and has an existing response, delete it
        if (!isCurrentlyChecked && existingResponseId) {
          return await deleteExistingInspectionForm(existingResponseId);
        }

        // If item is checked, create or update the response
        if (isCurrentlyChecked) {
          const responseData = {
            data: {
              checklist_item: item.id,
              checked: true,
              remarks: "",
              attachments: [],
              project_inspection: projectInspId
            },
          };

          if (existingResponseId) {
            return await updateExistingInspectionForm(
              existingResponseId,
              responseData
            );
          } else {
            return await createNewInspectionForm(responseData);
          }
        }
      });

      await Promise.all(submitPromises);
      showToast({
        title: "Success",
        message: "Inspection form submitted successfully!",
      });

      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error("Error submitting inspection form:", error);
      showToast({
        title: "Error",
        message: "Failed to submit inspection form",
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {toastVisible && <CustomToast />}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>Inspection Form</Text>
        </View>
      </View>

      <Text style={styles.title}>Dirt Pad Inspection</Text>
      <Text style={styles.description}>
        Verify the level and extent of the Dirt Pad after completion of
        excavation, filling, compaction, and grading.
      </Text>

      <View style={styles.checklistHeader}>
        <Text style={styles.checklistTitle}>Checklist</Text>
        <Text style={styles.checklistCount}>
          {Object.values(checkedItems).filter(Boolean).length} out of{" "}
          {checklistItems.length}
        </Text>
        <TouchableOpacity
          style={styles.checkAllButton}
          onPress={handleCheckAll}
        >
          <Text style={styles.checkAllButtonText}>
            {isAllChecked ? "Uncheck All" : "Check All"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.checklistContainer}>
        {checklistItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.checklistItem, item.required && styles.requiredItem]}
            onPress={() => toggleCheckbox(item.id)}
          >
            <View
              style={[
                styles.checkbox,
                checkedItems[item.id] && styles.checked,
                item.required && styles.requiredCheckbox,
              ]}
            >
              {checkedItems[item.id] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checklistItemText}>
              {item.description}
              {item.required && <Text style={styles.requiredText}> *</Text>}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FileUpload />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: fonts.WorkSans400,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    fontFamily: fonts.WorkSans400,
  },
  checklistHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: fonts.WorkSans400,
  },
  checklistCount: {
    marginLeft: 8,
    color: "#577CFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: fonts.WorkSans400,
  },
  checkAllButton: {
    marginLeft: "auto",
    backgroundColor: "#577CFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  checkAllButtonText: {
    color: "#fff",
  },
  checklistContainer: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0px 0px 9px 6px #00000014",
  },
  checklistItem: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 8,
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 3,
  },
  checked: {
    backgroundColor: "#577CFF",
    borderColor: "#577CFF",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: fonts.WorkSans400,
    fontSize: 12,
  },
  checklistItemText: {
    flex: 1,
    fontFamily: fonts.WorkSans400,
    fontSize: 12,
    color: "#000000",
    fontWeight: "400",
  },
  uploadSection: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  uploadTitle: {
    marginBottom: 8,
    fontFamily: fonts.WorkSans400,
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
  browseButton: {
    borderWidth: 1,
    borderColor: "#4169E1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  browseButtonText: {
    color: "#577CFF",
    fontFamily: fonts.WorkSans400,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#577CFF",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: fonts.WorkSans400,
  },
  categoryInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: fonts.WorkSans400,
  },
  requiredItem: {
    backgroundColor: "#fafafa",
  },
  requiredCheckbox: {
    borderColor: "#577CFF",
  },
  requiredText: {
    color: "#FF0000",
    marginLeft: 4,
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

export default InspectionForm;