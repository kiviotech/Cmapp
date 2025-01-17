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
    <TouchableOpacity
      style={styles.projectContainer}
      onPress={() =>
        navigation.navigate("(pages)/projectTeam/ProjectDetails", {
          projectId: item.id,
          projectData: item,
          contractorId: item.attributes.contractors?.data?.[0]?.id,
        })
      }
    >
      <View
        style={[styles.colorBar, { backgroundColor: item.color || "#4A90E2" }]}
      />
      <View style={styles.projectDetails}>
        <Text numberOfLines={1} style={styles.username}>
          {item.attributes.user?.data?.attributes?.username || "Unknown User"}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.projectName, { color: item.color || "#4A90E2" }]}
        >
          {item.attributes.name || "Unnamed Project"}
        </Text>
        <View style={styles.dateContainer}>
          <Text style={styles.startDate}>
            Started:{" "}
            {new Date(item.attributes.createdAt).toLocaleDateString("en-GB")}
          </Text>
          <Text style={styles.dueDate}>
            Due:{" "}
            {new Date(item.attributes.end_date).toLocaleDateString("en-GB")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.areaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Projects</Text>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <FlatList
          data={[...projectsDetail].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={renderProject}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No projects found</Text>
          }
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("(pages)/ProjectForm")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add New Project</Text>
      </TouchableOpacity>
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
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    width: "90%",
    alignSelf: "center",
    minHeight: 100,
  },
  colorBar: {
    width: 4,
    height: "100%",
    borderRadius: 4,
    marginRight: 12,
  },
  projectDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  username: {
    fontSize: 14,
    color: "#999",
  },
  projectName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  startDate: {
    fontSize: 12,
    color: "#4CAF50",
  },
  dueDate: {
    fontSize: 12,
    color: "#FC5275",
    fontWeight: "500",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  flatListContainer: {
    paddingBottom: height * 0.25,
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    zIndex: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProjectList;
