import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  FlatList,
  TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../../useAuthStore";
// import { getProjects } from "../../../src/api/repositories/projectRepository";
// import SelectYourProjectCard from "../../../components/SelectYourProjectCard";
import BottomNavigation from "./BottomNavigation ";
// import { fetchSubcategories } from "../../../src/services/subcategoryService";
import { fetchContractorsByUserId } from "../../../src/services/contractorService";
// import { fetchTasksByContractorId } from "../../../src/services/taskService";
import { getTaskByContractorId } from "../../../src/api/repositories/taskRepository";
import { MEDIA_BASE_URL } from "../../../src/api/apiClient";

// const renderCard = ({ item }) => (
//   <View style={styles.card}>
//     <View style={styles.cardHeader}>
//       <Text style={styles.title}>{item.title}</Text>
//       <Icon name="bell-outline" size={20} color="green" />
//     </View>
//     <Text style={styles.projectName}>{item.projectName}</Text>
//     <View style={styles.divider} />
//     <View style={styles.infoRow}>
//       <Icon name="calendar" size={20} color="black" />
//       <Text style={styles.infoText}>{item.date}</Text>
//     </View>
//     <View style={styles.infoRow}>
//       <Icon name="clock-outline" size={20} color="black" />
//       <Text style={styles.infoText}>{item.time}</Text>
//     </View>
//   </View>
// );

const Contractor = () => {
  const [contractorsData, setContractorsData] = useState([]);
  const navigation = useNavigation();
  const [projectsDetail, setProjectsDetail] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredData, setFilteredData] = useState(tasks);
  // const [contractorId, setContractorId] = useState([]);

  const { user, designation } = useAuthStore();
  // // console.log(user, designation)

  useEffect(() => {
    const loadContractorData = async () => {
      if (user && user.id) {
        try {
          const data = await fetchContractorsByUserId(user.id);
          setContractorsData(data.data); // Set entire array of contractors
          var filteredData = [];
          if (data.data.length > 0) {
            const contractorId = data.data[0].id; // Assuming one contractor per user
            const projectData = data.data.map(
              (project) => (filteredData = project.attributes.projects.data)
            );

            // Fetch tasks for each project ID in selectedProjectId
            const allTasks = [];
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
          }
        } catch (error) {
          console.error("Error fetching contractor data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadContractorData();
  }, []);

  // console.log('tasks', tasks[0].attributes.documents.data[0].attributes)

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView style={styles.container}>
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/165383754?v=4",
            }}
            style={styles.profileImage}
          />
          <View>
            {/* <Text style={styles.userName}>{user.username}</Text> */}
            <Text style={styles.userName}>
              {user ? user.username : "Guest"}
            </Text>
            <Text style={styles.userRole}>
              {designation || "No designation"}
            </Text>
          </View>
          <View style={styles.searchContainer}>
            {/* <TouchableOpacity style={styles.searchIcon}>
                <Icon name="search" size={24} color="#333" />
              </TouchableOpacity> */}
          </View>
        </View>

        {/* Select Your Project */}
        <Text style={styles.sectionHeader}>Select Your Project</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading projects...</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {contractorsData.length > 0 ? (
              contractorsData.map((contractor) =>
                contractor.attributes.projects.data.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={[
                      styles.projectCard,
                      project.attributes.project_status === "pending"
                        ? { backgroundColor: "#ffebee" }
                        : { backgroundColor: "#e8f5e9" },
                    ]}
                    onPress={() =>
                      navigation.navigate("(pages)/contractor/ProjectDetails", {
                        projectId: project.id,
                        projectData: project,
                        contractorId: contractor.id,
                      })
                    }
                  >
                    <View style={styles.projectCardContent}>
                      <Text style={styles.projectTitle}>
                        {project.attributes.name}
                      </Text>
                      <Text style={styles.projectDescription}>
                        {project.attributes.description}
                      </Text>
                      <Text style={styles.projectStatus}>
                        ● {project.attributes.project_status || "Status"}
                        {/* {project.attributes.phase || "Phase"} */}
                      </Text>
                      <View style={styles.projectStatusContainer}>
                        <Icon
                          name={
                            project.attributes.project_status === "ahead"
                              ? "check-circle"
                              : "error"
                          }
                          size={16}
                          color={
                            project.attributes.project_status === "ahead"
                              ? "green"
                              : "red"
                          }
                        />
                        <Text style={styles.projectStatusText}>
                          {project.attributes.project_status === "ahead"
                            ? "Ahead of Schedule"
                            : "Delayed"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )
            ) : (
              <View>
                <Text style={styles.noProjectsText}>No projects available</Text>
              </View>
            )}
          </ScrollView>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.milestoneHeader}>Upcoming Milestones</Text>
          {/* <Text style={styles.taskStatus}>7 Tasks Pending</Text> */}
          {/* <Icon name="tune" size={24} color="#333" style={styles.filterIcon} /> */}
        </View>
        
        {/* Milestone Cards */}
        {tasks.map((task) => (
          <View key={task.id} style={styles.milestoneCard}>
            <View style={styles.milestoneCard}>
              <Text style={styles.milestoneTitle}>
                {task.attributes.project.data.attributes.name || "Project"}
              </Text>
              {task.attributes.documents.data?.map((taskdoc) => (
                <Image
                  key={taskdoc.id} // Use a unique key for each task document
                  source={{
                    uri:
                      `${MEDIA_BASE_URL}${taskdoc.attributes.url}` ||
                      "https://via.placeholder.com/150",
                  }}
                  style={styles.milestoneImage}
                />
              ))}

              <View style={styles.milestoneContent}>
                <View style={styles.milestoneHeaderContainer}>
                  <Text style={styles.milestoneTitle}>
                    {task.attributes.standard_task.data.attributes.Name || "Task"}
                  </Text>
                  <View style={styles.substituteButton}>
                    <Text style={styles.substituteText}>Substructure</Text>
                  </View>
                </View>
                <Text style={styles.milestoneDescription}>
                  {task.attributes.standard_task.data.attributes.Description ||
                    "No description available for this task."}
                </Text>
                <View style={styles.divider} />
                <Text style={styles.deadlineText}>
                  <Icon name="event" size={16} color="#333" /> Deadline:{" "}
                  {task.attributes.due_date || "No deadline specified"}
                </Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() =>
                    navigation.navigate("(pages)/taskDetails", {
                      taskData: task,
                    })
                  }
                >
                  <Icon name="file-upload" size={16} color="#fff" />
                  <Text style={styles.uploadButtonText}>
                    Upload your Proof of work
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}


        {/* <View style={styles.milestoneCard}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.milestoneImage}
            />
            <View style={styles.milestoneContent}>
              <View style={styles.milestoneHeaderContainer}>
                <Text style={styles.milestoneTitle}>
                  Verification & Inspection
                </Text>
                <TouchableOpacity style={styles.substituteButton}>
                  <Text style={styles.substituteText}>Substructure</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.projectName}>Project Name</Text>
              <Text style={styles.milestoneDescription}>
                Regular site walkthroughs to ensure compliance with safety
                regulations and quality standards.
              </Text>
              <View style={styles.divider} />
              <Text style={styles.deadlineText}>
                <Icon name="event" size={16} color="#333" /> Deadline: Mon, 10
                July 2022
              </Text>
              <View style={styles.statusContainer}>
                <Icon name="check-circle" size={16} color="green" />
                <Text style={styles.statusText}>Uploaded Proof of Work</Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={styles.pendingDot} />
                <Text style={styles.statusText}>Pending Approval</Text>
              </View>
            </View>
          </View> */}
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    //  backgroundColor: '#fff',
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    marginBottom: 50,
    padding: 20,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 14,
    color: "#888",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginLeft: 55,
  },
  searchInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginLeft: "auto",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  overviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  overviewItem: {
    alignItems: "center",
    height: 70,
    width: 90,
    // borderWidth:1,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  overviewNumber1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#577CFF",
  },
  overviewNumber2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FB8951",
  },
  overviewNumber3: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#A3D65C",
  },
  overviewLabel1: {
    fontSize: 12,
    color: "#577CFF",
    top: 8,
    fontWeight: "bold",
  },
  overviewLabel2: {
    fontSize: 12,
    color: "#FB8951",
    top: 8,
    fontWeight: "bold",
  },
  overviewLabel3: {
    fontSize: 12,
    color: "#A3D65C",
    top: 8,
    fontWeight: "bold",
  },
  horizontalScrollContainer: {
    paddingHorizontal: 5,
  },
  projectCard: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    // elevation: 3,
    marginRight: 15,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  projectStatus: {
    fontSize: 14,
    color: "#ff5252",
    marginBottom: 10,
  },
  projectStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  projectStatusText: {
    marginLeft: 5,
    fontSize: 14,
    color: "green",
  },
  requestsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 14,
    color: "#1e90ff",
  },
  requestItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  requestDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  requestStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  requestStatusPending: {
    color: "#ff5252",
    fontWeight: "bold",
  },
  viewLink: {
    color: "#1e90ff",
  },

  //   !-----------===============================================

  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  milestoneHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskStatus: {
    color: "#888",
    fontSize: 14,
  },
  filterIcon: {
    marginLeft: "auto",
  },
  milestoneCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  milestoneImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  milestoneContent: {
    paddingBottom: 10,
  },
  milestoneHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  substituteButton: {
    backgroundColor: "#e3f2fd",
    padding: 5,
    borderRadius: 5,
  },
  substituteText: {
    color: "#1e90ff",
    fontSize: 14,
  },
  projectName: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  milestoneDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 10,
  },
  deadlineText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: "#1e90ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 5,
    color: "#666",
  },
  pendingDot: {
    width: 8,
    height: 8,
    backgroundColor: "#888",
    borderRadius: 4,
    marginRight: 5,
  },

  //   ~==================================================================================

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e1e1e",
    marginBottom: 16,
  },
  carousel: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    width: Dimensions.get("window").width * 0.75, // 75% of screen width for each card
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#576CE4", // Matches the blue color in the screenshot
  },
  projectName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  divider: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
});

export default Contractor;
