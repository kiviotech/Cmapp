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
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../../useAuthStore";
import BottomNavigation from "./BottomNavigation ";
import SelectYourProject from "./SelectYourProject";
import { fetchTasks } from "../../../src/services/taskService";
import { fetchContractorsByUserId } from "../../../src/services/contractorService";
import { fetchContractorsIdByUserId } from "../../../src/services/contractorService";
import { fetchContractorsWithSubContractor } from "../../../src/services/contractorService";
import { URL } from "../../../src/api/apiClient";

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
  const { user, designation, sub_contractor } = useAuthStore();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractorId, setContractorId] = useState(0); // State for contractor ID
  const [isListView, setIsListView] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [isProjectDropdownVisible, setProjectDropdownVisible] = useState(false);

  // Add this constant for status options
  const statusOptions = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Ahead", value: "ahead" },
    { label: "Delayed", value: "delayed" },
    { label: "Completed", value: "completed" },
  ];

  // Fetch contractor ID based on designation and user ID
  useEffect(() => {
    const fetchContractors = async () => {
      if (designation === "Contractor" && user?.id) {
        try {
          const response = await fetchContractorsIdByUserId(user.id);
          if (response?.data?.length > 0) {
            setContractorId(response.data[0]?.id);
            setProjects(response?.data[0]?.attributes?.projects?.data);
          }

          // Fetch and store sub-contractor data
          const contractorsWithSub = await fetchContractorsWithSubContractor(
            user.id
          );
          const subContractorName =
            contractorsWithSub?.data?.[0]?.attributes?.sub_contractor?.data
              ?.attributes?.name;

          // Store the sub_contractor name in the auth store
          useAuthStore.getState().setUser({
            ...user,
            designation,
            token: user.token,
            sub_contractor: subContractorName,
          });
        } catch (error) {
          console.error("Error fetching contractors:", error);
        }
      }
    };

    fetchContractors();
  }, [designation, user?.id]);

  // Fetch tasks only after contractorId is updated
  const fetchTasksWithPagination = async () => {
    if (!user?.id) return; // Early return if no user ID

    const idToUse = contractorId !== 0 ? contractorId : user.id;
    try {
      setIsLoading(true);
      const response = await fetchTasks(
        idToUse,
        currentPage,
        pageSize,
        designation.charAt(0).toLowerCase() + designation.slice(1)
      );

      const data = response.data;
      if (data && data.length > 0) {
        // const projectsData = data
        //   .map((taskData) => taskData?.attributes?.project?.data)
        //   .filter(
        //     (project, index, self) =>
        //       project && self.findIndex((p) => p?.id === project.id) === index
        //   );

        // setProjects(projectsData);
        setTasks(data);
        setTotalPages(Math.ceil(response.meta.pagination.total / pageSize));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combined useEffect for fetching tasks
  useEffect(() => {
    // Only fetch if we have either a contractorId or userId
    if (user?.id && (contractorId !== 0 || designation !== "Contractor")) {
      fetchTasksWithPagination();
    }
  }, [contractorId, user?.id]); // Simplified dependencies

  // Fetch tasks for the selected page
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Do not fetch if page is out of range
    setCurrentPage(page); // Update the current page
    fetchTasksWithPagination(); // Fetch data for the new page
  };

  // Render pagination buttons
  const renderPagination = () => {
    if (!totalPages || totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2;
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
      for (const i of range) {
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
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledPageButton,
          ]}
          onPress={() => currentPage > 1 && handlePageChange(currentPage - 1)}
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

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledPageButton,
          ]}
          onPress={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
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

  // Update the navigation handler
  const handleTaskPress = (task) => {
    navigation.navigate("(pages)/taskDetails", {
      taskData: task,
      refresh: true, // Always set refresh to true when navigating from Contractor
    });
  };

  // Add this function to handle outside clicks
  const handleOutsideClick = () => {
    if (isProjectDropdownVisible) {
      setProjectDropdownVisible(false);
    }
    if (isStatusDropdownVisible) {
      setStatusDropdownVisible(false);
    }
  };

  // Update the filtering logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task?.attributes?.standard_task?.data?.attributes?.Name?.toLowerCase().includes(
        searchQuery.toLowerCase()
      );
    const matchesStatus =
      selectedStatus === "" || task?.attributes?.task_status === selectedStatus;
    const matchesProject =
      selectedProject === "" ||
      task?.attributes?.project?.data?.id === selectedProject;
    return matchesSearch && matchesStatus && matchesProject;
  });

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
            <Text style={styles.userRole}>{sub_contractor}</Text>
          </View>
        </View>

        {/* Select Your Project Component */}
        <SelectYourProject isLoading={isLoading} projects={projects} />

        <View style={styles.headerContainer}>
          <Text style={styles.milestoneHeader}>Upcoming Milestones</Text>
          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isListView ? null : styles.activeToggle,
              ]}
              onPress={() => setIsListView(false)}
            >
              <Icon
                name="grid-view"
                size={18}
                color={!isListView ? "#fff" : "#666"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isListView ? styles.activeToggle : null,
              ]}
              onPress={() => setIsListView(true)}
            >
              <Icon
                name="view-list"
                size={18}
                color={isListView ? "#fff" : "#666"}
              />
            </TouchableOpacity>
          </View>
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

        {/* Add these JSX right after the search container and before the FlatList */}
        <View style={styles.filterContainer}>
          <View style={styles.dropdownsRow}>
            <View style={styles.dropdownWrapper}>
              <Pressable
                style={styles.projectDropdown}
                onPress={(e) => {
                  e.stopPropagation();
                  setProjectDropdownVisible(!isProjectDropdownVisible);
                }}
              >
                <Text style={styles.dropdownText}>
                  {selectedProject
                    ? projects.find((p) => p.id === selectedProject)?.attributes
                        ?.name || "Select Project"
                    : "Select Project"}
                </Text>
                <Icon
                  name={
                    isProjectDropdownVisible
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={24}
                  color="#666"
                />
              </Pressable>

              {isProjectDropdownVisible && (
                <View style={styles.dropdownMenu}>
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={(e) => {
                      e.stopPropagation();
                      setSelectedProject("");
                      setProjectDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>All Projects</Text>
                  </Pressable>
                  {projects.map((project) => (
                    <Pressable
                      key={project.id}
                      style={[
                        styles.dropdownItem,
                        selectedProject === project.id &&
                          styles.selectedDropdownItem,
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project.id);
                        setProjectDropdownVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedProject === project.id &&
                            styles.selectedDropdownItemText,
                        ]}
                      >
                        {project?.attributes?.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.statusDropdownContainer}>
              <TouchableOpacity
                style={styles.statusDropdown}
                onPress={() =>
                  setStatusDropdownVisible(!isStatusDropdownVisible)
                }
              >
                <Text style={styles.statusDropdownText}>
                  {selectedStatus
                    ? statusOptions.find((opt) => opt.value === selectedStatus)
                        ?.label
                    : "Select Status"}
                </Text>
                <Icon
                  name={
                    isStatusDropdownVisible
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>

              {isStatusDropdownVisible && (
                <View style={styles.dropdownMenu}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        selectedStatus === option.value &&
                          styles.selectedDropdownItem,
                      ]}
                      onPress={() => {
                        setSelectedStatus(option.value);
                        setStatusDropdownVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedStatus === option.value &&
                            styles.selectedDropdownItemText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : (
          <>
            <FlatList
              data={filteredTasks}
              key={isListView ? "list" : "grid"}
              numColumns={1}
              renderItem={({ item: task }) => {
                const taskImageUrl =
                  task?.attributes?.standard_task?.data?.attributes?.image
                    ?.data?.[0]?.attributes?.url || null;
                const imageUrl = taskImageUrl
                  ? `${URL}${taskImageUrl}`
                  : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

                return (
                  <TouchableOpacity
                    key={task.id}
                    style={[
                      styles.milestoneCard,
                      isListView ? styles.listViewCard : styles.gridViewCard,
                      {
                        backgroundColor:
                          task?.attributes?.task_status === "completed"
                            ? "#E8F5E9"
                            : task?.attributes?.task_status === "ongoing"
                            ? "#fff"
                            : task?.attributes?.task_status === "rejected"
                            ? "#FED5DD"
                            : "#fff",
                      },
                    ]}
                    onPress={() => handleTaskPress(task)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={[
                        styles.milestoneImage,
                        isListView
                          ? styles.listViewImage
                          : styles.gridViewImage,
                      ]}
                    />
                    <View style={styles.cardContent}>
                      <View style={styles.projectInfo}>
                        <Text
                          style={[
                            styles.projectTitle,
                            isListView
                              ? styles.listViewProjectTitle
                              : styles.gridViewProjectTitle,
                          ]}
                        >
                          Project:{" "}
                          {task?.attributes?.project?.data?.attributes?.name ||
                            "Project"}
                        </Text>
                        <View style={styles.taskNameContainer}>
                          <Text
                            style={[
                              styles.taskName,
                              isListView
                                ? styles.listViewTaskName
                                : styles.gridViewTaskName,
                            ]}
                          >
                            {task?.attributes?.standard_task?.data?.attributes
                              ?.Name || "Task"}
                          </Text>
                          {!isListView && (
                            <View style={styles.substructureBadge}>
                              <Text style={styles.substructureText}>
                                Substructure
                              </Text>
                            </View>
                          )}
                        </View>
                        {!isListView && (
                          <Text style={styles.taskDescription}>
                            Regular site inspections to ensure compliance with
                            building codes and standards.
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.cardFooter,
                          isListView
                            ? styles.listViewFooter
                            : styles.gridViewFooter,
                        ]}
                      >
                        <View style={styles.deadlineContainer}>
                          <Icon name="event" size={16} color="#666" />
                          <Text style={styles.deadlineText}>
                            Deadline:{" "}
                            {task?.attributes?.due_date ||
                              "No deadline specified"}
                          </Text>
                        </View>
                        {isListView ? (
                          <View style={styles.substructureBadge}>
                            <Text style={styles.substructureText}>
                              Substructure
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  task?.attributes?.task_status === "completed"
                                    ? "#E8F5E9"
                                    : task?.attributes?.task_status ===
                                        "ongoing" ||
                                      task?.attributes?.task_status ===
                                        "pending"
                                    ? "#FFF3E0"
                                    : task?.attributes?.task_status ===
                                      "rejected"
                                    ? "#FFEBEE"
                                    : "#F5F5F5",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                {
                                  color:
                                    task?.attributes?.task_status ===
                                    "completed"
                                      ? "#2E7D32"
                                      : task?.attributes?.task_status ===
                                          "ongoing" ||
                                        task?.attributes?.task_status ===
                                          "pending"
                                      ? "#EF6C00"
                                      : task?.attributes?.task_status ===
                                        "rejected"
                                      ? "#C62828"
                                      : "#757575",
                                },
                              ]}
                            >
                              {task?.attributes?.task_status || "Ongoing"}
                            </Text>
                          </View>
                        )}
                      </View>
                      {!isListView && (
                        <TouchableOpacity
                          style={styles.uploadButton}
                          onPress={() => handleTaskPress(task)}
                        >
                          <Icon
                            name="upload"
                            size={18}
                            color="#fff"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={styles.uploadButtonText}>
                            Upload your Proof of work
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.flatListContainer}
              ListFooterComponent={
                isLoading ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : null
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
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 20,
    marginTop: 10,
  },
  pageButton: {
    paddingVertical: "8px",
    paddingHorizontal: "12px",
    border: "1px solid #A5A5A5",
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    minWidth: "40px",
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    position: "relative",
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  searchIcon: {
    position: "absolute",
    left: 15,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingLeft: 45,
    paddingRight: 15,
    height: 45,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 14,
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
    marginBottom: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  milestoneHeader: {
    fontSize: 18,
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
    marginBottom: 10,
    elevation: 3,
  },
  milestoneImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  milestoneContent: {
    flex: 1,
    gap: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deadlineText: {
    fontSize: 14,
    color: "#666",
  },
  tagContainer: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#2196F3",
    fontSize: 12,
    fontWeight: "500",
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
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
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
  filterContainer: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 15,
    paddingHorizontal: 5,
    position: "relative",
    zIndex: 1000,
  },
  dropdownsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 1001,
    flex: 1,
    minWidth: 150,
  },
  projectDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  statusDropdownContainer: {
    position: "relative",
    zIndex: 1001,
    flex: 1,
    minWidth: 150,
  },
  statusDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    minWidth: 150,
    justifyContent: "space-between",
  },
  statusDropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1002,
    minWidth: "100%",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  selectedDropdownItem: {
    backgroundColor: "#4A6FFF",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDropdownItemText: {
    color: "#fff",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "#D1D1D1",
  },
  toggleButton: {
    padding: 6,
    borderRadius: 6,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: "#4A6FFF",
  },
  flatListContainer: {
    padding: 8,
  },
  listViewCard: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  gridViewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listViewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    flexShrink: 0,
  },
  gridViewImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  listViewTitle: {
    fontSize: 16,
  },
  gridViewTitle: {
    fontSize: 14,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  projectInfo: {
    marginBottom: 12,
  },
  taskName: {
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0", // Light gray border
    paddingTop: 16, // Add padding to create space between border and content
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  deadlineText: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#FB8C00",
    fontSize: 14,
    fontWeight: "500",
  },
  uploadButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  // Base styles
  projectTitle: {
    marginBottom: 4,
  },
  taskName: {
    marginBottom: 8,
  },

  // Grid view specific styles
  gridViewProjectTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000", // Changed to black to match task name
  },
  gridViewTaskName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    flex: 1, // This allows the badge to sit next to it
    marginRight: 8, // Add some space between task name and badge
  },

  // List view specific styles
  listViewProjectTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  listViewTaskName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },

  listViewFooter: {
    marginBottom: 0,
    borderTopWidth: 0,
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },

  gridViewFooter: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 16,
    marginBottom: 16,
  },

  taskNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  substructureBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: "auto",
  },

  substructureText: {
    color: "#2196F3",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default Contractor;
