import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAuthStore from "../../../useAuthStore";
import { getProjects } from "../../../src/api/repositories/projectRepository";
import SelectYourProjectCard from "../../../components/SelectYourProjectCard";
import BottomNavigation from "./BottomNavigation";
import { fetchSubmissions } from "../../../src/services/submissionService";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { fetchProjectTeamIdByUserId } from "../../../src/services/projectTeamService";
import { fetchProjectDetailsByApproverId } from "../../../src/services/projectService";
import apiClient, {
  BASE_URL,
  MEDIA_BASE_URL,
  URL,
} from "../../../src/api/apiClient";
import { fetchTasks } from "../../../src/services/taskService";
import { icons } from "../../../constants";

// const data = [
//   {
//     id: "1",
//     title: "Inspection",
//     projectName: "Project Name",
//     date: "Mon, 10 July 2022",
//     time: "9 AM - 10:30 AM",
//   },
//   {
//     id: "2",
//     title: "Inspection",
//     projectName: "Project Name",
//     date: "Mon, 10 July 2022",
//     time: "9 AM - 10:30 AM",
//   },
//   {
//     id: "3",
//     title: "Inspection",
//     projectName: "Project Name",
//     date: "Mon, 10 July 2022",
//     time: "9 AM - 10:30 AM",
//   },
// ];

// const renderCard = ({ item }) => (
//   <View style={styles.card}>
//     <View style={styles.cardHeader}>
//       <Text style={styles.title}>{item.title}</Text>
//       <MaterialCommunityIcons name="bell-outline" size={20} color="green" />
//     </View>
//     <Text style={styles.projectName}>{item.projectName}</Text>
//     <View style={styles.divider} />
//     <View style={styles.infoRow}>
//       <MaterialCommunityIcons name="calendar" size={20} color="black" />
//       <Text style={styles.infoText}>{item.date}</Text>
//     </View>
//     <View style={styles.infoRow}>
//       <MaterialCommunityIcons name="clock-outline" size={20} color="black" />
//       <Text style={styles.infoText}>{item.time}</Text>
//     </View>
//   </View>
// );

// const getProjectStatus = (project) => {
//   const status = project?.attributes?.project_status;
//   switch (status) {
//     case "completed":
//       return { text: "Completed", color: "#4CAF50" };
//     case "ongoing":
//       return { text: "Ongoing", color: "#2196F3" };
//     case "pending":
//       return { text: "Pending", color: "#FFA000" };
//     default:
//       return { text: "Unknown", color: "#757575" };
//   }
// };

const ProjectTeam = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const navigation = useNavigation();
  // const [projectsDetail, setProjectsDetail] = useState([]);
  // const [tasksDetail, setTasksDetail] = useState([]);
  // const [selectedProjectId, setSelectedProjectId] = useState(null);
  // const [jobProfile, setJobProfile] = useState("");
  // const [subcategories, setSubcategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  // const [projectTeamId, setProjectTeamId] = useState(null);
  const [projectDetails, setProjectDetails] = useState([]);
  // const [taskDetails, setTaskDetails] = useState([]);
  const { user, designation, role, permissions } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5; // Explicitly set to show 5 tasks per page
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isListView, setIsListView] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isStatusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [isProjectDropdownVisible, setProjectDropdownVisible] = useState(false);

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Ahead", value: "ahead" },
    { label: "Delayed", value: "delayed" },
    { label: "Completed", value: "completed" },
  ];

  useEffect(() => {
    const fetchContractors = async () => {
      // if (designation === "Contractor" && user?.id) {
      try {
        const response = await fetchProjectTeamIdByUserId(user.id);
        if (response?.data?.length > 0) {
          setProjects(response?.data[0]?.attributes?.projects?.data);
        }
      } catch (error) {
        console.error("Error fetching contractors:", error);
      }
      // }
    };

    fetchContractors();
  }, [designation, user?.id]);

  // Update the fetch function to use the pageSize
  const fetchTasksWithPagination = async (userId, page) => {
    setIsLoading(true);
    try {
      // Pass pageSize parameter to API call
      const response = await fetchTasks(userId, page, pageSize);
      const data = response.data;
      const meta = response.meta?.pagination;

      if (data) {
        // Ensure we only show pageSize number of tasks
        setTasks(data.slice(0, pageSize));
        if (meta) {
          setTotalPages(Math.ceil(meta.total / pageSize));
          setCurrentPage(meta.page);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to respond to currentPage changes
  useEffect(() => {
    if (user?.id) {
      fetchTasksWithPagination(user.id, currentPage);
    }
  }, [user, currentPage]); // Add currentPage as dependency

  // Update page change handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      fetchTasksWithPagination(user.id, newPage);
    }
  };

  // Update pagination render function
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const renderPageButton = (pageNum) => (
      <TouchableOpacity
        key={pageNum}
        style={[
          styles.pageButton,
          currentPage === pageNum && styles.activePageButton,
        ]}
        onPress={() => handlePageChange(pageNum)}
        disabled={currentPage === pageNum}
      >
        <Text
          style={[
            styles.pageText,
            currentPage === pageNum && styles.activePageText,
          ]}
        >
          {pageNum}
        </Text>
      </TouchableOpacity>
    );

    let pages = [];

    // Add previous page button
    pages.push(
      <TouchableOpacity
        key="prev"
        style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Icon
          name="chevron-left"
          size={20}
          color={currentPage === 1 ? "#ccc" : "#333"}
        />
      </TouchableOpacity>
    );

    // Show maximum 5 pages
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middlePoint = Math.floor(maxVisiblePages / 2);

      if (currentPage <= middlePoint + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - middlePoint) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - middlePoint;
        endPage = currentPage + middlePoint;
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(renderPageButton(i));
    }

    // Add next page button
    pages.push(
      <TouchableOpacity
        key="next"
        style={[
          styles.pageButton,
          currentPage === totalPages && styles.disabledButton,
        ]}
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Icon
          name="chevron-right"
          size={20}
          color={currentPage === totalPages ? "#ccc" : "#333"}
        />
      </TouchableOpacity>
    );

    return <View style={styles.paginationContainer}>{pages}</View>;
  };

  const ongoingProjectsCount = projects.filter(
    (item) => item?.attributes?.project_status === "ongoing"
  ).length;

  const completedProjectsCount = projects.filter(
    (item) => item?.attributes?.project_status === "completed"
  ).length;

  useFocusEffect(
    useCallback(() => {
      const fetchRequests = async () => {
        try {
          const response = await fetchSubmissions();
          const submissions = response?.data || [];
          const recentRequests = submissions
            .sort(
              (a, b) =>
                new Date(b?.attributes?.createdAt) -
                new Date(a?.attributes?.createdAt)
            )
            .slice(0, 2);
          setRequests(recentRequests);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };

      fetchRequests();
    }, [])
  );

  const filteredTasks = (tasks) => {
    return tasks
      .filter((taskDetail) => {
        const matchesSearch =
          taskDetail?.attributes?.standard_task?.data?.attributes?.Name?.toLowerCase().includes(
            searchQuery.toLowerCase()
          );
        const matchesStatus =
          selectedStatus === "" ||
          taskDetail?.attributes?.task_status === selectedStatus;
        const matchesProject =
          selectedProject === "" ||
          taskDetail?.attributes?.project?.data?.id === selectedProject;
        return matchesSearch && matchesStatus && matchesProject;
      })
      .slice(0, pageSize);
  };

  // Modify the handleOutsideClick function
  const handleOutsideClick = () => {
    if (isProjectDropdownVisible) {
      setProjectDropdownVisible(false);
    }
    if (isStatusDropdownVisible) {
      setStatusDropdownVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <Pressable style={{ flex: 1 }} onPress={handleOutsideClick}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
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
              {/* <TouchableOpacity style={styles.searchIcon}>
                <Icon name="search" size={24} color="#333" />
              </TouchableOpacity> */}
            </View>

            <Text style={styles.sectionHeader}>Project Overview</Text>
            <View style={styles.overviewContainer}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewNumber1}>{projects.length}</Text>
                <Text style={styles.overviewLabel1}>Total Projects</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewNumber2}>
                  {ongoingProjectsCount}
                </Text>
                <Text style={styles.overviewLabel2}>Active</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewNumber3}>
                  {completedProjectsCount}
                </Text>
                <Text style={styles.overviewLabel3}>Completed</Text>
              </View>
            </View>

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
                {projects.length > 0 ? (
                  projects.map((project) => {
                    const isDelayed =
                      project?.attributes?.project_status === "delayed"; // Define isDelayed based on status
                    const projectStatus = {
                      text:
                        project?.attributes?.project_status
                          ?.charAt(0)
                          ?.toUpperCase() +
                        project?.attributes?.project_status?.slice(1),
                    }; // Define projectStatus

                    return (
                      <TouchableOpacity
                        key={project.id}
                        style={[
                          styles.projectCard,
                          (() => {
                            const endDate = new Date(
                              project?.attributes?.end_date
                            );
                            const today = new Date();
                            const isDelayed = today > endDate;

                            return isDelayed
                              ? { backgroundColor: "#ffebee" } // Light red for delayed
                              : { backgroundColor: "#e8f5e9" }; // Light green for on schedule
                          })(),
                        ]}
                        onPress={() =>
                          navigation.navigate(
                            "(pages)/projectTeam/ProjectDetails",
                            {
                              projectId: project.id,
                              projectData: project,
                              userId: user.id,
                              tasksData: tasks,
                            }
                          )
                        }
                      >
                        <View style={styles.projectCardContent}>
                          {/* Project Name and Description */}
                          <Text style={styles.projectTitle}>
                            {project?.attributes?.name || "No Project Name"}
                          </Text>
                          <Text style={styles.projectDescription}>
                            {project?.attributes?.description
                              ? project?.attributes?.description?.length > 50
                                ? `${project?.attributes?.description?.slice(
                                    0,
                                    50
                                  )}...`
                                : project?.attributes?.description
                              : "No description available"}
                          </Text>

                          {/* Project Status */}
                          <View style={styles.statusContainer}>
                            <View
                              style={[
                                styles.projectStatusBadge,
                                {
                                  backgroundColor: "#FFFFFF",
                                  alignSelf: "flex-start",
                                  marginBottom: 8,
                                },
                              ]}
                            >
                              <View style={styles.statusBadgeContent}>
                                <View
                                  style={[
                                    styles.statusDot,
                                    {
                                      backgroundColor: isDelayed
                                        ? "#ff5252"
                                        : "#4caf50",
                                    },
                                  ]}
                                />
                                <Text style={styles.projectStatusText}>
                                  {projectStatus.text || "Unknown"}
                                </Text>
                              </View>
                            </View>
                            {/* <View style={styles.statusIndicator}>
                              <Icon
                                name={isDelayed ? "error" : "check-circle"}
                                size={16}
                                color={isDelayed ? "#ff5252" : "#4caf50"}
                              />
                              <Text
                                style={[
                                  styles.statusText,
                                  { color: isDelayed ? "#ff5252" : "#4caf50" },
                                ]}
                              >
                                {isDelayed ? "Delayed" : "On Schedule"}
                              </Text>
                            </View> */}
                          </View>

                          {/* Project End Date */}
                          <View style={styles.dateContainer}>
                            <Icon name="event" size={16} color="#666" />
                            <Text style={styles.dateText}>
                              End Date:{" "}
                              {project?.attributes?.end_date
                                ? new Date(
                                    project?.attributes?.end_date
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Not set"}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.noProjectsContainer}>
                    <Text style={styles.noProjectsText}>
                      No projects available
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.requestsHeader}>
              <Text style={styles.sectionHeader}>Requests</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("(pages)/Request")}
              >
                <Text style={styles.seeAllButton}>See all</Text>
              </TouchableOpacity>
            </View>

            {requests.length > 0 ? (
              requests.map((request) => (
                <TouchableOpacity
                  key={request?.id}
                  style={styles.requestItem}
                  onPress={() => {
                    navigation.navigate("(pages)/TaskRequestDetails", {
                      requestData: request,
                    });
                  }}
                >
                  <View style={styles.submissionCard}>
                    <View style={styles.requestMainContent}>
                      <Text style={styles.requestTitle}>
                        {
                          request?.attributes?.submitted_by?.data?.attributes
                            ?.username
                        }
                      </Text>

                      <View style={styles.subCardContainer}>
                        <Image
                          source={icons.check_list}
                          style={styles.requestIcon}
                        />
                        <Text style={styles.requestText} numberOfLines={1}>
                          {request?.attributes?.task?.data?.attributes
                            ?.standard_task?.data?.attributes?.Name || "task"}
                        </Text>
                      </View>

                      <View style={styles.subCardContainer}>
                        <Image
                          source={icons.project_diagram}
                          style={styles.requestIcon}
                        />
                        <Text style={styles.requestText} numberOfLines={1}>
                          {request?.attributes?.task?.data?.attributes?.project
                            ?.data?.attributes?.name || "Project"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.statusCard}>
                      <Text
                        style={[
                          styles.statusBold,
                          request?.attributes?.status === "approved"
                            ? styles.requestStatusApproved
                            : request?.attributes?.status === "rejected"
                            ? styles.requestStatusRejected
                            : request?.attributes?.status === "pending"
                            ? styles.requestStatusPendingText
                            : {},
                        ]}
                      >
                        {request?.attributes?.status
                          ? request?.attributes?.status
                              .charAt(0)
                              .toUpperCase() +
                            request?.attributes?.status.slice(1).toLowerCase()
                          : "Pending"}
                      </Text>

                      <View style={styles.submissionDate}>
                        <Icon name="event" size={16} color="#666" />
                        <Text style={styles.subDate}>
                          {request?.attributes?.createdAt.slice(0, 10)}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => {
                          navigation.navigate("(pages)/TaskRequestDetails", {
                            requestData: request,
                          });
                        }}
                      >
                        <Text style={styles.viewLink}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noRequestsText}>No requests available</Text>
            )}

            <View style={styles.container1}>
              <View style={styles.milestoneContainer}>
                <View style={styles.headerContainer}>
                  <Text style={styles.milestoneHeader}>
                    Upcoming Milestones
                  </Text>
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
              </View>
            </View>

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
                        ? projects.find((p) => p.id === selectedProject)
                            ?.attributes?.name || "Select Project"
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
                        <Text style={styles.dropdownItemText}>
                          All Projects
                        </Text>
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
                        ? statusOptions.find(
                            (opt) => opt.value === selectedStatus
                          )?.label
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

            <FlatList
              data={filteredTasks(tasks)}
              numColumns={1}
              key={isListView ? "list" : "grid"}
              renderItem={({ item: task }) => {
                if (isListView) {
                  const taskImageUrl = task?.attributes?.documents?.data?.[0]
                    ? `${URL}${task?.attributes?.documents?.data[0]?.attributes?.url}`
                    : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("(pages)/taskDetails", {
                          taskData: task,
                        })
                      }
                      style={styles.listItemContainer}
                    >
                      <View style={styles.listItem}>
                        <View style={styles.listItemContent}>
                          <Image
                            source={{ uri: taskImageUrl }}
                            style={styles.listItemImage}
                          />
                          <View style={styles.listItemDetails}>
                            <Text style={styles.taskName}>
                              {task?.attributes?.standard_task?.data?.attributes
                                ?.Name || "Task"}
                            </Text>
                            <Text style={styles.projectNameText}>
                              {task?.attributes?.project?.data?.attributes
                                ?.name || "Project"}
                            </Text>

                            <View style={styles.taskInfoRow}>
                              <View style={styles.deadlineContainer}>
                                <Icon name="event" size={16} color="#666" />
                                <Text style={styles.deadlineText}>
                                  Deadline:{" "}
                                  {task?.attributes?.due_date ||
                                    "No deadline specified"}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }
                const taskImageUrl = task?.attributes?.documents?.data?.[0]
                  ? `${URL}${task?.attributes?.documents?.data[0]?.attributes?.url}`
                  : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

                return (
                  <View
                    key={task.id}
                    style={[
                      styles.milestoneCard,
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
                  >
                    <Image
                      source={{ uri: taskImageUrl }}
                      style={styles.milestoneImage}
                    />
                    <View style={styles.milestoneContent}>
                      <Text style={styles.milestoneTitle}>
                        Project:{" "}
                        {task?.attributes?.project?.data?.attributes?.name ||
                          "Project"}
                      </Text>
                      <View style={styles.milestoneHeaderContainer}>
                        <View style={styles.projectTaskName}>
                          <Text style={styles.milestoneTitle}>
                            {task?.attributes?.standard_task?.data?.attributes
                              ?.Name || "Task"}
                          </Text>
                        </View>
                        <View style={styles.substituteButton}>
                          <Text style={styles.substituteText}>
                            Substructure
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.milestoneDescription}>
                        {task?.attributes?.standard_task?.data?.attributes
                          ?.Description ||
                          "No description available for this task."}
                      </Text>
                      <View style={styles.divider} />
                      <View style={styles.status_container}>
                        <Text style={styles.deadlineText}>
                          <Icon
                            name="event"
                            size={16}
                            color="#333"
                            style={{ position: "relative", top: "3px" }}
                          />{" "}
                          Deadline:{" "}
                          {task?.attributes?.due_date ||
                            "No deadline specified"}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                task?.attributes?.task_status === "completed"
                                  ? "#E8F5E9"
                                  : task?.attributes?.task_status === "ongoing"
                                  ? "#FFF3E0"
                                  : task?.attributes?.task_status === "rejected"
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
                                  task?.attributes?.task_status === "completed"
                                    ? "#2E7D32"
                                    : task?.attributes?.task_status ===
                                      "ongoing"
                                    ? "#EF6C00"
                                    : task?.attributes?.task_status ===
                                      "rejected"
                                    ? "#C62828"
                                    : "#757575",
                              },
                            ]}
                          >
                            {task?.attributes?.task_status || "pending"}
                          </Text>
                        </View>
                      </View>
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
                <>
                  {isLoading && (
                    <ActivityIndicator size="small" color="#0000ff" />
                  )}
                  {!isLoading && totalPages > 1 && renderPagination()}
                </>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.noProjectsText}>
                    {isLoading ? "Loading..." : "No tasks available."}
                  </Text>
                </View>
              }
            />
          </ScrollView>
        </View>
      </Pressable>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case "completed":
      return styles.completedStatus;
    case "ongoing":
      return styles.ongoingStatus;
    case "ahead":
      return styles.aheadStatus;
    case "delayed":
      return styles.delayedStatus;
    default:
      return styles.pendingStatus;
  }
};

const styles = StyleSheet.create({
  status_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    // backgroundColor: "#fff",
    width: "100%",
    paddingBottom: 80,
  },
  noProjectsText: {
    color: "red",
    paddingBottom: "20px",
    fontSize: "18px",
    // textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    paddingBottom: 100,
  },
  container1: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingVertical: 20,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  userRole: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
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
    height: 60,
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
    width: 280,
    padding: 16,
    borderRadius: 8,
    marginRight: 15,
    elevation: 2,
  },
  projectCardContent: {
    gap: 8,
  },
  projectCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  projectCardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statusRow: {
    marginTop: 8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
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
    marginBottom: 40,
  },
  milestoneContainer: {
    flex: 1,
  },
  milestoneHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: 240,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "bold",
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
    // marginBottom: 15,
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
    marginVertical: 8,
  },
  projectStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  statusBadgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requestItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submissionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  requestMainContent: {
    flex: 1,
    minWidth: 0, // Ensures text truncation works properly
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  requestIcon: {
    width: 18,
    height: 18,
    flexShrink: 0,
  },
  requestText: {
    color: "#666",
    flex: 1,
    fontSize: 14,
  },
  statusCard: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minWidth: 100,
  },
  submissionDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 8,
  },
  subDate: {
    color: "#666",
    fontSize: 12,
  },
  viewButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewLink: {
    color: "#1e90ff",
    fontSize: 14,
    fontWeight: "500",
  },
  requestStatusApproved: {
    color: "#38A169",
    fontSize: 14,
    fontWeight: "bold",
  },
  requestStatusRejected: {
    color: "#E53E3E",
    fontSize: 14,
    fontWeight: "bold",
  },
  requestStatusPendingText: {
    color: "#ED6C02",
    fontSize: 14,
    fontWeight: "bold",
  },
  noRequestsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    paddingVertical: 20,
  },
  requestsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  seeAllButton: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "500",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
  },
  activePageButton: {
    backgroundColor: "#1e90ff",
    borderColor: "#1e90ff",
  },
  disabledButton: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  pageText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  activePageText: {
    color: "#fff",
  },
  listItemContainer: {
    marginBottom: 12,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  listItemDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  projectNameText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  taskInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: "#1e90ff",
    fontSize: 14,
    fontWeight: "500",
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
});

export default ProjectTeam;
