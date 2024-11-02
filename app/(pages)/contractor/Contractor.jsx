import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../../constants";
import SubtaskCard from "../../../components/SubtaskCard";
import SelectYourProjectCard from "../../../components/SelectYourProjectCard";
import { useNavigation } from "@react-navigation/native"; // Import the hook
import CustomHomePageCard from "../../../components/CustomHomePageCard/CustomHomePageCard";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import { getProjects } from "../../../src/api/repositories/projectRepository";
import {
  getTasksByUserAndProject,
  getTasksByUser,
} from "../../../src/api/repositories/taskRepository";
import { getUserId } from "../../../src/utils/storage";
import BottomNavigation from "../BottomNavigation ";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTasks } from "../../../src/api/repositories/taskRepository";
import { getAuthenticatedUserWithPopulate } from "../../../src/api/repositories/userRepository";
import useAuthStore from "../../../useAuthStore";

const Contractor = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const navigation = useNavigation(); // Use the hook to get navigation object
  const [projectsDetail, setProjectsDetail] = useState([]);
  const [tasksDetail, setTasksDetail] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null); // New state for selected project
  const [jobProfile, setJobProfile] = useState("");

  const { user, roles, permissions } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getAuthenticatedUserWithPopulate(
          "job_profile"
        );
        setJobProfile(userResponse.data.job_profile.name);
      } catch (error) {
        console.log("error");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectData = await getProjects();
        if (isMounted && projectData?.data?.data) {
          // Ensure we have unique projects based on ID
          const uniqueProjects = Array.from(
            new Map(
              projectData.data.data.map((item) => [item.id, item])
            ).values()
          );
          setProjectsDetail(uniqueProjects);
          if (uniqueProjects.length > 0) {
            setSelectedProjectId(uniqueProjects[0]?.id);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (isMounted) {
          setProjectsDetail([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchTasksForUser = async () => {
      if (selectedProjectId) {
        try {
          const storedId = JSON.parse(await AsyncStorage.getItem("id")); // Fetch the user ID from local storage
          if (storedId) {
            const taskData = await getTasksByUserAndProject(
              storedId,
              selectedProjectId
            );
            setTasksDetail(taskData.data.data);
          }
        } catch (error) {
          console.error("Error fetching tasks for project:", error);
        }
      }
    };

    fetchTasksForUser();
  }, [selectedProjectId]); // Refetch tasks when project changes
  // console.log(tasksDetail);
  const handleSearchPress = () => {
    setSearchVisible(!isSearchVisible);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId); // Update selected project when clicked
  };

  const completedTasks = tasksDetail.filter(
    (task) => task.attributes.status === "completed"
  );

  const notCompletedTasks = tasksDetail.filter(
    (task) =>
      task.attributes.status === "not_completed" ||
      task.attributes.status === "rejected"
  );
  const [username, setUsername] = useState(null); // Set initial state as null for loading state

  const getUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      console.log("Stored username from AsyncStorage:", storedUsername); // Debug log
      const storedTasks = await AsyncStorage.getItem("tasks");
      console.log("Stored tasks from AsyncStorage: ", storedTasks);
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setUsername("Guest"); // Set default if no username is stored
      }
    } catch (error) {
      console.error("Error retrieving username from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image source={icons.user1} style={styles.profileImage} />
          <View>
            <Text style={styles.userName}>
              {username ? username : "Loading..."}{" "}
              {/* Display username or loading */}
            </Text>
            <Text style={styles.greeting}>{roles}</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.icon} onPress={handleSearchPress}>
              <Image source={icons.search} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("(pages)/notification")}
              style={styles.icon}
            >
              <Image source={icons.bell} />
            </TouchableOpacity>
          </View>
        </View>

        {isSearchVisible && (
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              placeholderTextColor="#999"
            />
          </View>
        )}

        <Text style={styles.title}>Select Your Project</Text>

        {/* Horizontal ScrollView for the Carousel */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading projects...</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
            {projectsDetail.length > 0 ? (
              projectsDetail.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.cardWrapper,
                    selectedProjectId === project.id &&
                      styles.selectedCardWrapper,
                  ]}
                  onPress={() => handleProjectSelect(project.id)}
                >
                  <SelectYourProjectCard
                    cardValue={{
                      name: project.attributes.name,
                      desc: project.attributes.description,
                      update: project.attributes.update_status,
                      deadline: project.attributes.deadline,
                    }}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noProjectsContainer}>
                <Text style={styles.noProjectsText}>No projects available</Text>
              </View>
            )}
          </ScrollView>
        )}

        <Text style={styles.projectitle}>
          {projectsDetail.find((project) => project.id === selectedProjectId)
            ?.attributes.name || "Project"}
        </Text>

        {/* Recent Milestones */}
        <View style={styles.milestoneContainer}>
          <View>
            <Text style={styles.userName}>Recent Milestones</Text>
            <Text style={[styles.greeting, { paddingTop: 5 }]}>
              {completedTasks.length} Tasks Done
            </Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.icon}>
              <Image source={icons.filters} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {completedTasks.length > 0 ? (
            <View style={styles.yourProjectContainer}>
              {completedTasks.map((cardData, index) => (
                <SubtaskCard
                  key={cardData.id || index}
                  cardValue={cardData}
                  cardColor="#EEF7E0"
                />
              ))}
            </View>
          ) : (
            <View style={styles.noTasksContainer}>
              <Text style={styles.noTasksText}>No completed tasks</Text>
            </View>
          )}
        </ScrollView>

        {/* Upcoming Milestones */}
        <View style={styles.milestoneContainer}>
          <View>
            <Text style={styles.userName}>Upcoming Milestones</Text>
            <Text style={[styles.greeting, { paddingTop: 5 }]}>
              {notCompletedTasks.length} Tasks Pending
            </Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.icon}>
              <Image source={icons.filters} />
            </TouchableOpacity>
          </View>
        </View>

        {notCompletedTasks.map((cardData, index) => (
          <CustomHomePageCard key={index} cardValue={cardData} />
        ))}
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default Contractor;

// ... existing styles ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 150,
    // Ensure enough padding so that scroll content doesn't overlap the BottomNavigation
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    paddingBottom: 20,
  },
  searchBarContainer: {
    padding: 10,
    marginTop: -10,
    marginBottom: 10,
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchBar: {
    height: 40,
    width: "100%",
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.whiteColor,
  },
  projectitle: {
    color: "#000",
    // fontFamily: fonts.WorkSans600,
    fontSize: 26,
    marginTop: 20,
  },
  title: {
    color: "#000",
    // fontFamily: fonts.WorkSans600,
    fontSize: 26,
    marginTop: 40,
  },
  profileImage: {
    width: 50,
    height: 50,
    // borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 12,
    color: "#577CFF",
    // fontFamily: fonts.WorkSans400,
  },
  userName: {
    color: "#000B23",
    fontSize: 20,
    // fontFamily: fonts.WorkSans600,
  },
  iconsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  icon: {
    marginLeft: 15,
    borderColor: colors.borderColor,
    // borderRadius: "100%",
    borderWidth: 1,
    padding: 10,
  },
  carousel: {
    marginTop: 20,
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginRight: 15,
  },
  yourProjectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    marginTop: 10,
  },
  milestoneContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.whiteColor,
    borderTopWidth: 1,
    borderColor: colors.borderColor,
  },
  selectedCardWrapper: {
    borderWidth: 2,
    borderColor: colors.primary, // Indicate selected project with border color or background color
    borderRadius: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  noProjectsContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  noProjectsText: {
    fontSize: 16,
    color: "#666",
  },
  noTasksContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  noTasksText: {
    fontSize: 16,
    color: "#666",
  },
});
