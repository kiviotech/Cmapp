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
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../../useAuthStore";
import BottomNavigation from "./BottomNavigation ";
import SelectYourProject from "./SelectYourProject";
import { fetchTasks } from "../../../src/services/taskService";

const validateImageURL = (url) => {
  return url && (url.startsWith("http://") || url.startsWith("https://"));
};

const Contractor = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1); // Current page
  const pageSize = 5; // Number of tasks per page
  const { user, designation } = useAuthStore();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

   // Function to fetch tasks for a specific page
   const fetchTasksWithPagination = async (userId, page) => {
    // if (isLoading) return; // Prevent multiple calls if already loading
    setIsLoading(true); // Start loading
    try {
      const response = await fetchTasks(userId, page, pageSize);
      const data = response.data;

      if (data && data.length > 0) {
        // Extract unique projects
        const projectsData = data
          .map((taskData) => taskData?.attributes?.project?.data)
          .filter(
            (project, index, self) =>
              project && self.findIndex((p) => p?.id === project.id) === index
          );

        setProjects(projectsData); // Append unique projects
        // Append tasks and projects while ensuring no duplicates
        setTasks(data);
        // Set total pages based on the response
        setTotalPages(Math.ceil(response.meta.pagination.total / pageSize));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Initial fetch on page load
  useEffect(() => {
    if (user && user.id) {
      fetchTasksWithPagination(user.id, 1); // Load the first page
      setCurrentPage(1); // Reset the page to 1
    }
  }, [user]);

  // Fetch tasks for the selected page
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Do not fetch if page is out of range
    setCurrentPage(page); // Update the current page
    fetchTasksWithPagination(user.id, page); // Fetch data for the new page
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i && styles.activePageButton,
          ]}
          onPress={() => handlePageChange(i)}
        >
          <Text
            style={[
              styles.pageText,
              currentPage === i && styles.activePageText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.paginationContainer}>{pages}</View>;
  };


  // const fetchTasksWithPagination = async (userId, page) => {
  //   try {
  //     setIsLoading(true); // Start loading
  //     const response = await fetchTasks(userId, page, pageSize); // Use page state for pagination
  //     const data = response.data;

  //     // Extract unique projects
  //     const projectsData = data
  //       .map((taskData) => taskData?.attributes?.project?.data)
  //       .filter(
  //         (project, index, self) =>
  //           project && self.findIndex((p) => p?.id === project.id) === index
  //       );

  //     setTasks((prevTasks) => [...prevTasks, ...data]); // Append tasks to the existing ones
  //     setProjects((prevProjects) => [...prevProjects, ...projectsData]); // Append unique projects
  //     setHasMore(data.length === pageSize); // Check if more tasks are available
  //   } catch (error) {
  //     console.error('Error fetching contractor data:', error);
  //   } finally {
  //     setIsLoading(false); // End loading
  //   }
  // };

  // const debounce = (func, delay) => {
  //   let timeout;
  //   return (...args) => {
  //     if (timeout) clearTimeout(timeout);
  //     timeout = setTimeout(() => func(...args), delay);
  //   };
  // };
  // // Debounced version of fetchTasksWithPagination
  // const debouncedFetchTasks = debounce((userId, page) => {
  //   fetchTasksWithPagination(userId, page);
  // }, 500); // Adjust delay as necessary

  // useEffect(() => {
  //   if (user && user.id) {
  //     debouncedFetchTasks(user.id, page); // Trigger debounced fetch
  //   }
  // }, [user, page]);

  // const loadMoreTasks = () => {
  //   if (!isLoading && hasMore) {
  //     setPage((prevPage) => prevPage + 1); // Increment page for the next batch of tasks
  //   }
  // };

  // useEffect(() => {
  //   const loadContractorData = async () => {
  //     if (user && user.id) {
  //       try {
  //         setIsLoading(true); // Start loading  
  //         const data = await fetchTasks(user.id);  
  //         const projectsData = data.data
  //           .map((taskData) => taskData?.attributes?.project?.data) // Map to project data
  //           .filter(
  //             (project, index, self) =>
  //               project && // Ensure project is not null or undefined
  //               self.findIndex((p) => p?.id === project.id) === index // Ensure unique projects
  //           );  
  //         setTasks(data.data); // Set tasks
  //         setProjects(projectsData); // Set unique projects  
  //       } catch (error) {
  //         console.error('Error fetching contractor data:', error);
  //       } finally {
  //         setIsLoading(false); // End loading
  //       }
  //     }
  //   };

  //   loadContractorData();
  // }, [user]);

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userInfoContainer}>
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/165383754?v=4",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userRole}>{designation}</Text>
          </View>
        </View>

        {/* Select Your Project Component */}
        <SelectYourProject
          isLoading={isLoading}
          projects={projects}
        />

        <View style={styles.headerContainer}>
          <Text style={styles.milestoneHeader}>Upcoming Milestones</Text>
        </View>

        {/* Add Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : (
          <>
            <FlatList
              data={tasks.filter((task) =>
                task.attributes.project.data.attributes.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )}
              renderItem={({ item: task }) => {
                const taskImageUrl = task?.attributes?.documents?.data?.[0]
                  ?.attributes?.url
                  ? `${URL}${task.attributes.documents.data[0].attributes.url}`
                  : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

                return (
                  <View key={task.id} style={styles.milestoneCard}>
                    <Text style={styles.milestoneTitle}>
                      {task.attributes.project.data.attributes.name ||
                        "Project"}
                    </Text>
                    <Image
                      source={{ uri: taskImageUrl }}
                      style={styles.milestoneImage}
                    />
                    <View style={styles.milestoneContent}>
                      <View style={styles.milestoneHeaderContainer}>
                        <View style={styles.projectTaskName}>
                          <Text style={styles.milestoneTitle}>
                            {task.attributes.standard_task.data.attributes.Name ||
                              "Task"}
                          </Text>
                        </View>
                        <View style={styles.substituteButton}>
                          <Text style={styles.substituteText}>
                            Substructure
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.milestoneDescription}>
                        {task.attributes.standard_task.data.attributes
                          .Description ||
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
                );
              }}
              keyExtractor={(item) => item.id.toString()}

              ListFooterComponent={
                isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : null
              }
            />
            {totalPages > 1 && renderPagination()}
          </>

        )}
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom:20,
    marginTop:-10
  },
  pageButton: {
    padding: '8px 12px',
    border: '1px solid #A5A5A5',
    borderRadius: '5px',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '40px',
    height:30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  activePageButton: {
    backgroundColor: "#007bff",
  },
  pageText: {
    color: "#000",
  },
  activePageText: {
    color: "#fff",
  },
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
    justifyContent: "center",
    justifyContent: "center",
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
    textAlign: "center",
    textAlign: "center",
  },
  userRole: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 45,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
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
    width: 220,
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
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
  projectTaskName: {
    display: 'flex',
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
    padding: 5,
    marginBottom: 15,
    display: "flex",
    alignItems: "center",
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

  loaderContainer: {
    paddingTop: 30,
  },
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
  projectEndDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginTop: 5,
  },
  endDateIcon: {
    marginRight: 4,
  },
  projectEndDate: {
    fontSize: 14,
    color: "#666",
  },
});

export default Contractor;
