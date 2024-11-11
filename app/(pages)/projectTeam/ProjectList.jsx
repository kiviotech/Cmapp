import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { getProjects } from "../../../src/api/repositories/projectRepository";
import BottomNavigation from "./BottomNavigation";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ProjectList = () => {
  const [projectsDetail, setProjectsDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectData = await getProjects();
        if (isMounted && projectData?.data?.data) {
          const uniqueProjects = Array.from(
            new Map(
              projectData.data.data.map((item) => [item.id, item])
            ).values()
          );
          setProjectsDetail(uniqueProjects);
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

    return () => {
      isMounted = false;
    };
  }, []);

  const renderProject = ({ item }) => (
    <View style={styles.projectContainer}>
      <View
        style={[styles.colorBar, { backgroundColor: item.color || "#4A90E2" }]}
      />
      <View style={styles.projectDetails}>
        <Text style={styles.username}>
          {item.attributes.user?.data?.attributes?.username || "Unknown User"}
        </Text>
        <Text style={[styles.projectName, { color: item.color || "#4A90E2" }]}>
          {item.attributes.name || "Unnamed Project"}
        </Text>
        <Text style={styles.startDate}>
          Started on {new Date(item.attributes.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.dueDate}>
          Due {new Date(item.attributes.end_date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.areaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Projects</Text>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <FlatList
          data={projectsDetail}
          keyExtractor={(item) => item.id}
          renderItem={renderProject}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* </View> */}
      <TouchableOpacity
        onPress={() => navigation.navigate("(pages)/ProjectForm")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add New Project</Text>
      </TouchableOpacity>
      {/* </View> */}
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  areaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    // elevation: 3,
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f8fc",
    paddingTop: height * 0.05,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.04,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#1e1e1e",
    marginBottom: height * 0.02,
  },
  projectContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  colorBar: {
    width: width * 0.02,
    height: "100%",
    borderRadius: 4,
    marginRight: width * 0.03,
  },
  projectDetails: {
    flex: 1,
  },
  username: {
    fontSize: width * 0.035,
    color: "#999",
  },
  projectName: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginVertical: height * 0.005,
  },
  startDate: {
    fontSize: width * 0.035,
    color: "#4CAF50",
  },
  dueDate: {
    fontSize: width * 0.035,
    color: "#FC5275",
    fontWeight: "500",
    position: "absolute",
    right: width * 0.04,
    bottom: height * 0.015,
  },
  flatListContainer: {
    paddingBottom: height * 0.18,
  },
  addButton: {
    position: "absolute",
    bottom: height * 0.12,
    right: width * 0.05,
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "500",
  },
});

export default ProjectList;
