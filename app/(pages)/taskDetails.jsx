import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity } from "react-native";
import CustomButton from "../../components/CustomButton";
import { icons } from "../../constants";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { useRoute } from "@react-navigation/native";
import { getTaskById } from "../../src/api/repositories/taskRepository";
import BottomNavigation from "./BottomNavigation ";
import { useNavigation } from "@react-navigation/native";

const TaskDetails = () => {
  const [tasksDetail, setTasksDetail] = useState([]);
  const route = useRoute();
  const { id } = route.params || {}; // Default to an empty object if params is undefined
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchTasksByID = async () => {
      try {
        const taskData = await getTaskById(id);
        setTasksDetail(taskData.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTasksByID();
  }, [id]);

  return (
    <View style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <SafeAreaView style={styles.safeAreaView}>

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.detailsText}>Details</Text>
            <View style={styles.deadlineContainer}>
              <Image source={icons.calendar} />
              <Text style={styles.deadlineText}>
                Deadline: {tasksDetail?.attributes?.deadline}
              </Text>
            </View>
          </View>

          {/* Image Placeholder */}
          <View style={styles.imagePlaceholder}>
            {tasksDetail?.attributes?.image_url && (
              <Image
                source={{ uri: tasksDetail.attributes.image_url }}
                style={styles.taskImage}
              />
            )}
          </View>

          {/* Project Info Section */}
          <View style={styles.projectInfo}>
            <View style={styles.projectTitleContainer}>
              <Text style={styles.projectTitle}>
                {tasksDetail?.attributes?.name}
              </Text>
              <CustomButton
                buttonStyle={{
                  backgroundColor: "#D5DDF9",
                  fontSize: 8,
                  width: 120,
                  height: 35,
                }}
                textStyle={{
                  fontFamily: "WorkSans_500Medium",
                  color: "#577CFF",
                }}
                text={tasksDetail?.attributes?.stage?.data?.attributes?.name}
              />
            </View>
            <Text style={styles.projectDescription}>
              {tasksDetail?.attributes?.description}
            </Text>
          </View>

          {/* Table Section */}
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>
                Consultant / Third Party / Inspector
              </Text>
              <Text style={styles.tableContent}>Surveyor</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>
                Required Drawings / Documents
              </Text>
              <Text style={styles.tableContent}>
                {tasksDetail?.attributes?.documents}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>QA Team Process</Text>
              <Text style={styles.tableContent}>
                {tasksDetail?.attributes?.qa}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>QC Team Process</Text>
              <Text style={styles.tableContent}>
                {tasksDetail?.attributes?.qc}
              </Text>
            </View>
            {tasksDetail?.attributes?.rejection_comment && (
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Rejection Comment</Text>
                <Text style={styles.tableContent}>
                  {tasksDetail.attributes.rejection_comment}
                </Text>
              </View>
            )}
          </View>

          {/* Attachments Section */}
          <View style={styles.showAttechmentsContainer}>
            <View style={styles.showAttechments}>
              <Image source={icons.showAttechments} />
              <Text style={{ color: colors.primary, fontFamily: fonts.WorkSans400, fontSize: 12 }}>
                Show attachments
              </Text>
            </View>

            {/* Upload Proof Button */}
            <TouchableOpacity
              style={[styles.showAttechments, styles.uploadProof]}
              onPress={() => navigation.navigate("(pages)/uploadProof", { id: id })}
            >
              <Image source={icons.upload} />
              <Text style={{ color: colors.whiteColor, fontFamily: fonts.WorkSans400, fontSize: 12 }}>
                Upload your Proof of work
              </Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    padding: 10,
  },
  safeAreaView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsText: {
    fontSize: 24,
    fontFamily: fonts.WorkSans600,
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  deadlineText: {
    color: colors.radiusColor,
    marginLeft: 8,
    fontFamily: fonts.WorkSans500,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: colors.background,
    borderRadius: 10,
    marginBottom: 16,
  },
  taskImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  projectInfo: {
    marginBottom: 16,
  },
  projectTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: fonts.WorkSans600,
  },
  projectDescription: {
    color: colors.blackColor,
    fontFamily: fonts.WorkSans400,
    fontSize: 12,
    paddingTop: 25,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  tableHeader: {
    flex: 2,
    fontWeight: "600",
    color: colors.primary,
    fontFamily: fonts.WorkSans500,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: colors.borderColor,
    paddingRight: 10,
  },
  tableContent: {
    flex: 1,
    textAlign: "right",
    color: colors.blackColor,
    fontFamily: fonts.WorkSans400,
    fontSize: 10,
    paddingLeft: 10,
  },
  showAttechmentsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  showAttechments: {
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    color: colors.primary,
  },
  uploadProof: {
    backgroundColor: colors.primary,
    marginTop: 15,
  },
});

export default TaskDetails;