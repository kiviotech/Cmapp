import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getRegistrations,
  updateRegistration,
} from "../../src/api/repositories/registrationRepository";
import {
  getSubmissions,
  updateSubmission,
} from "../../src/api/repositories/submissionRepository";
import { createUser } from "../../src/api/repositories/userRepository";
import useAuthStore from "../../useAuthStore";
import { fetchContractorsByUserId } from "../../src/services/contractorService";
import { getTaskByContractorId } from "../../src/api/repositories/taskRepository";
import { icons } from "../../constants";
import BottomNavigation from "./contractor/BottomNavigation ";

const UploadProof = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [submissionDetail, setSubmissionDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedHistory, setUploadedHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);

  const { user } = useAuthStore();

  useEffect(() => {
    const SubmissionData = async () => {
      if (user && user.id) {
        try {
          const data = await fetchContractorsByUserId(user.id);
          // setContractorsData(data.data); // Set entire array of contractors
          var filteredData = [];
          if (data.data.length > 0) {
            const contractorId = data.data[0].id; // Assuming one contractor per user
            const projectData = data.data.map(
              (project) => (filteredData = project.attributes.projects.data)
            );

            // setProjectsDetail(filteredData)

            // Fetch tasks for each project ID in selectedProjectId
            const allTasks = [];
            const submissionData = [];
            let submission = [];
            let unread = [];
            let read = [];
            for (const projectId of filteredData) {
              const taskData = await getTaskByContractorId(
                projectId.id,
                contractorId
              );
              const ongoingTasks = taskData.data.data.filter(
                (task) => task.attributes.task_status === "ongoing"
              );
              allTasks.push(...ongoingTasks); // Accumulate tasks for each project
            }
            setTasks(allTasks); // Update tasks state with all fetched tasks

            for (const item of allTasks) {
              submission = item.attributes.submissions.data
              submissionData.push(submission);
              unread = unread.concat(
                submission?.filter((elem) => elem.attributes.notification_status === 'unread')
              );
              read = read.concat(
                submission?.filter((elem) => elem.attributes.notification_status === 'read')
              );
            }
            setSubmissionDetail(submissionData);
            setUnreadNotifications(unread);
            setReadNotifications(read);
          }
        } catch (error) {
          console.error("Error fetching contractor data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    SubmissionData();
  }, []);


  const handleDeleteNotification = (id) => {
    const updatedDetails = submissionDetail.map((history) =>
      history.filter((data) => data.id !== id)
    );
    setSubmissionDetail(updatedDetails.filter((history) => history.length > 0));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.border}>
        <TouchableOpacity
          onPress={() => navigation.navigate("(pages)/dashboard")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          {/* Back Icon */}
        </TouchableOpacity>
        <Text style={styles.instructions}>Notifications</Text>
      </View>

      <ScrollView style={{ marginBottom: 50 }}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          tasks.map((task, taskIndex) => (
            <View key={`task-${taskIndex}`} style={{ marginHorizontal: 20 }}>
              {task.attributes.submissions.data?.map((history, historyIndex) => (
                <View
                  key={`history-${history.id}-${historyIndex}`} // Ensure unique keys
                  style={{ marginBottom: 10 }} // Optional: Add some spacing
                >
                  <Text style={styles.taskTitle}>
                    {task?.attributes?.standard_task?.data?.attributes?.Name}
                  </Text>
                  <TouchableOpacity
                    style={styles.notificationContainer}
                  // Uncomment and adjust the navigation logic if needed
                  // onPress={() =>
                  //   navigation.navigate("(pages)/notificationDetails", {
                  //     historyId: history.id, // Pass history.id as a parameter
                  //   })
                  // }
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image source={icons.file} />
                      <Text style={styles.pagraph}>
                        Your submission for{" "}
                        {task.attributes.standard_task.data.attributes.Name} has been:{" "}
                        {history.attributes.status}
                      </Text>
                    </View>
                    <Text>
                      Comments:{" "}
                      {history.attributes.comment
                        ? history.attributes.comment
                        : "No Comments"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
              {/* Uncomment if you need the delete button */}
              {/* <CustomButton
          buttonStyle={styles.deleteButton}
          textStyle={styles.deleteButtonText}
          text="Delete"
          handlePress={() => handleDeleteNotification(data.id)}
        /> */}
            </View>
          ))
        )}
      </ScrollView>


      <BottomNavigation />
    </SafeAreaView>
  );
};

export default UploadProof;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  instructions: {
    fontSize: 24,
    // fontFamily: fonts.WorkSans600,
    paddingLeft: 20,
  },
  pagraph: {
    color: colors.blackColor,
    fontSize: 20,
    padding: 5,
    // fontWeight: 500,
    marginLeft: 10,
    // fontFamily: fonts.WorkSans400,
  },
  seeMore: {
    textAlign: "center",
    color: colors.primary,
  },
  border: {
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  taskTitle: {
    fontSize: 20,
    marginVertical: 10
  },
  notificationContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    gap: 10, // Adds a subtle shadow effect
  },
  // seeMoreButton: {
  //   // backgroundColor: "#000",
  //   backgroundColor: "#ffffff",
  //   padding: 3,
  //   borderRadius: 100,
  //   shadowColor: "#000", // Shadow color
  //   shadowOffset: { width: 0, height: 2 }, // Shadow offset (x and y)
  //   shadowOpacity: 0.25, // Shadow opacity
  //   shadowRadius: 3.84, // Shadow blur radius
  //   elevation: 5, // Shadow for Android
  //   justifyContent: "flex-end",
  //   width: 120,
  // },
  deleteButton: {
    marginTop: 8,
    backgroundColor: "red",
    paddingVertical: 8,
    borderRadius: 4,
    width: "20%",
  },
  deleteButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});
