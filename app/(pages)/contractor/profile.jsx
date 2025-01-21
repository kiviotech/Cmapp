import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigation from "./BottomNavigation ";
import colors from "../../../constants/colors";
import useAuthStore from "../../../useAuthStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SelectYourProject from "./SelectYourProject";
import { fetchProjectAndDocumentByUserId } from "../../../src/services/taskService";
import { fetchContractorsIdByUserId } from "../../../src/services/contractorService";

const profile = () => {
  const { user, designation } = useAuthStore();
  const router = useRouter();
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractorId, setContractorId] = useState(0);
  const [uploadedHistory, setUploadedHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // Prevent duplicate API calls

  const renderPagination = () => {
    if (!totalPages || totalPages <= 1) return null;

    // const getPageNumbers = () => {
    //   const delta = 2;
    //   const range = [];
    //   const rangeWithDots = [];

    //   // Always include first page
    //   range.push(1);

    //   for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    //     if (i > 1 && i < totalPages) {
    //       range.push(i);
    //     }
    //   }

    //   // Always include last page
    //   if (totalPages > 1) {
    //     range.push(totalPages);
    //   }

    //   // Add dots and numbers to final array
    //   let l;
    //   for (const i of range) {
    //     if (l) {
    //       if (i - l === 2) {
    //         rangeWithDots.push(l + 1);
    //       } else if (i - l !== 1) {
    //         rangeWithDots.push("...");
    //       }
    //     }
    //     rangeWithDots.push(i);
    //     l = i;
    //   }

    //   return rangeWithDots;
    // };

    const getPageNumbers = () => {
      // Dynamically generate page numbers (e.g., with dots for large ranges)
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <View style={styles.paginationContainer}>
        {/* Previous Button */}
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

        {/* Page Numbers */}
        {getPageNumbers().map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pageButton,
              currentPage === item && styles.activePageButton,
            ]}
            onPress={() => handlePageChange(item)}
          >
            <Text
              style={[
                styles.pageText,
                currentPage === item && styles.activePageText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Next Button */}
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

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page); // Update the page state
    }
  };
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
  }, [designation, user?.id]);

  useEffect(() => {
    // Only fetch if we have either a contractorId or userId
    if (user?.id && (contractorId !== 0 || designation !== "Contractor")) {
      fetchProjects();
    }
  }, [contractorId, user]);

  const fetchProjects = async () => {
    if (!user?.id) return; // Early return if no user ID
    const idToUse = contractorId !== 0 ? contractorId : user.id;
    if (isFetching) return; // Prevent duplicate calls
    setIsFetching(true);
    try {
      const response = await fetchProjectAndDocumentByUserId(
        idToUse,
        currentPage,
        pageSize,
        designation.charAt(0).toLowerCase() + designation.slice(1)
      );
      const data = response.data;

      if (data && data.length > 0) {
        // Extracting unique project data
        const projectsData = data
          .map((taskData) => taskData?.attributes?.project?.data) // Extract project data
          .filter((project) => project) // Filter out null or undefined
          .filter(
            (project, index, self) =>
              self.findIndex((p) => p?.id === project?.id) === index // Ensure uniqueness
          );

        // If at least one valid project exists, set it; otherwise, keep the existing state

        setProjects(projectsData);

        console.log("Projects Data:", projectsData);

        // Filtering tasks with submissions
        const tasksWithSubmissions = data.filter(
          (task) => task?.attributes?.submissions?.data?.length > 0
        );
        setUploadedHistory(tasksWithSubmissions);

        // Set total pages for pagination
        setTotalPages(Math.ceil(response.meta.pagination.total / pageSize));
      } else {
        // If no data at all, clear the states
        console.log("No tasks found, clearing states.");
        setProjects([]);
        setUploadedHistory([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: 10, marginBottom: 30 }}
      >
        <View>
          <View style={styles.profileImageContiner}>
            <Image
              style={styles.userImage}
              source={{
                uri: "https://avatars.githubusercontent.com/u/165383754?v=4",
              }}
            ></Image>
          </View>
          <View style={styles.profileDetailSection}>
            <Text style={styles.userName}>
              {user?.username ? user?.username : "Guest"}
            </Text>
            <Text style={[styles.userName, { color: colors.primary }]}>
              {designation ? designation : ""}
            </Text>
          </View>
        </View>

        {uploadedHistory?.map((history, historyIndex) => {
          // Get only the first submission from the submissions array
          const firstSubmission = history?.attributes?.submissions?.data?.[0];
          const totalSubmissions =
            history?.attributes?.submissions?.data?.length || 0;

          return (
            <View key={historyIndex} style={styles.submissionSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Submission for{" "}
                  {history?.attributes?.standard_task?.data?.attributes?.Name ||
                    "N/A"}{" "}
                  for{" "}
                  {history?.attributes?.project?.data?.attributes?.name ||
                    "N/A"}
                </Text>
                {totalSubmissions > 1 && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/contractor/submission-history",
                        params: {
                          submissions: JSON.stringify(
                            history?.attributes?.submissions?.data
                          ),
                          taskName:
                            history?.attributes?.standard_task?.data?.attributes
                              ?.Name,
                          projectName:
                            history?.attributes?.project?.data?.attributes
                              ?.name,
                        },
                      })
                    }
                  >
                    <Text style={styles.viewAllLink}>
                      View all ({totalSubmissions})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {firstSubmission && (
                <TouchableOpacity
                  style={styles.submissionContainer}
                  onPress={() => {
                    router.push({
                      pathname: "/contractor/submission-details",
                      params: {
                        submission: JSON.stringify(firstSubmission),
                        taskName:
                          history?.attributes?.standard_task?.data?.attributes
                            ?.Name,
                        projectName:
                          history?.attributes?.project?.data?.attributes?.name,
                        allSubmissions: JSON.stringify(
                          history?.attributes?.submissions?.data
                        ),
                      },
                    });
                  }}
                >
                  <View style={styles.submissionItem}>
                    <View style={styles.fileIconContainer}>
                      <FontAwesome5 name="file-alt" size={24} color="#666" />
                    </View>
                    <View style={styles.submissionDetails}>
                      <Text style={styles.documentName}>Document_name.png</Text>
                      <Text style={styles.submissionDate}>
                        Submitted on:{" "}
                        {firstSubmission?.attributes?.createdAt?.slice(0, 10) ||
                          "N/A"}
                      </Text>
                      <Text style={styles.submissionComment}>
                        {firstSubmission?.attributes?.comment || "No comments"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            firstSubmission?.attributes?.status === "approved"
                              ? "#4CAF50"
                              : "#FF9800",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {firstSubmission?.attributes?.status || "pending"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <View style={{ marginTop: 20 }}>
          <SelectYourProject isLoading={isLoading} projects={projects} />
        </View>
        {totalPages > 1 && renderPagination()}
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default profile;

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
  container: {
    flex: 1,

    backgroundColor: colors.background,
    paddingBottom: 45,
  },
  profileImageContiner: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  userImage: {
    width: 115,
    height: 115,
    borderRadius: 57.5,
    borderRadius: 57.5,
    objectFit: "cover",
  },
  profileDetailSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  userName: {
    color: colors.blackColor,
    // fontFamily: fonts.WorkSans600,
    fontSize: 26,
    letterSpacing: 0.13,
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 18,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    // fontFamily: fonts.WorkSans500,
    color: colors.blackColor,
  },
  projectTasksContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  projectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.blackColor,
  },

  taskCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },

  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.blackColor,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  taskDetails: {
    gap: 8,
  },

  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  taskInfoText: {
    color: "#666",
    fontSize: 14,
  },

  submissionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  viewAllLink: {
    color: "#007AFF",
    fontSize: 14,
  },
  submissionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  submissionDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  submissionDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  submissionComment: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  documentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  documentInfo: {
    flexDirection: "row",
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  documentDetails: {
    flex: 1,
  },

  documentDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },

  viewAllButton: {
    alignSelf: "flex-end",
    padding: 8,
  },

  viewAllText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },

  submissionSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  viewAllLink: {
    color: "#007AFF",
    fontSize: 14,
  },
  submissionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    paddingLeft: 10,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 5,
  },
  projectCard: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
  },
  projectCardContent: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  projectStatus: {
    fontSize: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  projectStatusText: {
    marginLeft: 5,
    fontSize: 14,
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
  noProjectsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});
