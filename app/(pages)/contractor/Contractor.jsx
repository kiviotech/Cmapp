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
import { fetchContractorsByUserId } from "../../../src/services/contractorService";
import { fetchContractorsIdByUserId } from "../../../src/services/contractorService";

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
  const [contractorId, setContractorId] = useState(0); // State for contractor ID

  // Fetch contractor ID based on designation and user ID
  useEffect(() => {
    const fetchContractors = async () => {
      if (designation === "Contractor" && user?.id) {
        try {
          const response = await fetchContractorsIdByUserId(user.id);
          if (response?.data?.length > 0) {
            setContractorId(response.data[0]?.id);
          }
        } catch (error) {
          console.error("Error fetching contractors:", error);
        }
      }
    };

    fetchContractors();
  }, [designation, user?.id]); // More specific dependency

  // Fetch tasks for the selected page
  const handlePageChange = async (newPage) => {
    if (newPage < 1) return;

    // Reset data and update page
    setTasks([]);
    setProjects([]);
    setCurrentPage(newPage);

    const idToUse = contractorId !== 0 ? contractorId : user?.id;
    if (!idToUse) return;

    try {
      setIsLoading(true);
      const response = await fetchTasks(
        idToUse,
        newPage,
        pageSize,
        designation.charAt(0).toLowerCase() + designation.slice(1)
      );

      if (response?.data) {
        setTasks(response.data);

        // Update total pages from response metadata
        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.pageCount);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user?.id && (contractorId !== 0 || designation !== "Contractor")) {
      handlePageChange(1);
    }
  }, [contractorId, user?.id]);

  // Update pagination render function
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2; // Number of pages to show before and after current page
      const range = [];
      const rangeWithDots = [];

      // Always include first page
      range.push(1);

      for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i > 1 && i < totalPages) {
          range.push(i);
        }
      }

      // Always include last page
      if (totalPages > 1) {
        range.push(totalPages);
      }

      // Add dots and numbers to final array
      let l;
      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    };

    return (
      <View style={styles.paginationContainer}>
        {/* Previous button */}
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledPageButton,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text
            style={[
              styles.pageText,
              currentPage === 1 && styles.disabledPageText,
            ]}
          >
            {"<"}
          </Text>
        </TouchableOpacity>

        {/* Page numbers */}
        {getPageNumbers().map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pageButton,
              currentPage === item && styles.activePageButton,
              item === "..." && styles.dotsButton,
            ]}
            onPress={() => item !== "..." && handlePageChange(item)}
            disabled={item === "..."}
          >
            <Text
              style={[
                styles.pageText,
                currentPage === item && styles.activePageText,
                item === "..." && styles.dotsText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Next button */}
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledPageButton,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text
            style={[
              styles.pageText,
              currentPage === totalPages && styles.disabledPageText,
            ]}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        <SelectYourProject isLoading={isLoading} projects={projects} />

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
              data={tasks}
              renderItem={({ item: task }) => {
                const taskImageUrl = task?.attributes?.documents?.data?.[0]
                  ?.attributes?.url
                  ? `${URL}${task?.attributes?.documents?.data[0]?.attributes?.url}`
                  : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

                return (
                  <View key={task.id} style={styles.milestoneCard}>
                    <Text style={styles.milestoneTitle}>
                      {task?.attributes?.project?.data?.attributes?.name ||
                        "Unassigned Project"}
                    </Text>
                    <Image
                      source={{ uri: taskImageUrl }}
                      style={styles.milestoneImage}
                    />
                    <View style={styles.milestoneContent}>
                      <View style={styles.milestoneHeaderContainer}>
                        <View style={styles.projectTaskName}>
                          <Text style={styles.milestoneTitle}>
                            {task?.attributes?.standard_task?.data?.attributes
                              ?.Name || "Task"}
                          </Text>
                        </View>
                        <View style={styles.substituteButton}>
                          <Text style={styles.substituteText}>
                            {task?.attributes?.task_status || "Status"}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.milestoneDescription}>
                        {task?.attributes?.standard_task?.data?.attributes
                          ?.Description ||
                          "No description available for this task."}
                      </Text>
                      <View style={styles.divider} />
                      <Text style={styles.deadlineText}>
                        <Icon name="event" size={16} color="#333" /> Deadline:{" "}
                        {task?.attributes?.due_date || "No deadline specified"}
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
              ListEmptyComponent={() => (
                <Text style={styles.noTasksText}>No tasks found</Text>
              )}
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
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 20,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#A5A5A5",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    minWidth: 40,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  activePageButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  disabledPageButton: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
  },
  dotsButton: {
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  pageText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  activePageText: {
    color: "#fff",
  },
  disabledPageText: {
    color: "#999",
  },
  dotsText: {
    color: "#666",
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
    display: "flex",
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
  noTasksText: {
    textAlign: "center",
    padding: 20,
    color: "#666",
    fontSize: 16,
  },
});

export default Contractor;
