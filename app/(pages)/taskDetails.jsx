import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import BottomNavigation from "./BottomNavigation ";
import { icons } from "../../constants";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { useRoute } from "@react-navigation/native";
import { getTaskById } from "../../src/api/repositories/taskRepository";
const taskDetails = () => {
  const [tasksDetail, setTasksDetail] = useState([]);
  const route = useRoute();
  const { id } = route.params || {}; // Default to an empty object if params is undefined

  console.log("sdfsdfsdf", id);
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
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.detailsText}>Details</Text>
            <View style={styles.deadlineContainer}>
              <Image source={icons.calendar} />
              <Text style={styles.deadlineText}>
                Deadline:{tasksDetail?.attributes?.deadline}
              </Text>
            </View>
          </View>

          {/* Image Placeholder */}
          <View style={styles.imagePlaceholder} />

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
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 16, // Space from all sides
    backgroundColor: colors.whiteColor,
  },
  container: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
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
});

export default taskDetails;
