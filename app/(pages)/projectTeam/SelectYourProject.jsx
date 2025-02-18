import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const SelectYourProject = ({ isLoading, contractorsData }) => {
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading projects...</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.sectionHeader}>Select Your Project</Text>
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
                  (() => {
                    const endDate = new Date(project.attributes.end_date);
                    const today = new Date();
                    const isDelayed = today > endDate;

                    return isDelayed
                      ? { backgroundColor: "#ffebee" }
                      : { backgroundColor: "#e8f5e9" };
                  })(),
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

                  <Text
                    style={[
                      styles.projectStatus,
                      {
                        color: (() => {
                          const endDate = new Date(project.attributes.end_date);
                          const today = new Date();
                          return today > endDate ? "#ff5252" : "#4caf50";
                        })(),
                      },
                    ]}
                  >
                    {(() => {
                      const endDate = new Date(project.attributes.end_date);
                      const today = new Date();
                      const isDelayed = today > endDate;

                      return (
                        <>
                          <Icon
                            name={isDelayed ? "error" : "check-circle"}
                            size={16}
                            color={isDelayed ? "red" : "green"}
                          />
                          <Text
                            style={[
                              styles.projectStatusText,
                              { color: isDelayed ? "red" : "green" },
                            ]}
                          >
                            {isDelayed ? "Delayed" : "On Schedule"}
                          </Text>
                        </>
                      );
                    })()}
                  </Text>
                  <View style={styles.projectEndDateContainer}>
                    <Icon
                      name="event"
                      size={16}
                      color="#666"
                      style={styles.endDateIcon}
                    />
                    <Text style={styles.projectEndDate}>
                      End Date:{" "}
                      {new Date(project.attributes.end_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
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
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 5,
  },
  projectCard: {
    width: 250,
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectCardContent: {
    gap: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  projectStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  projectStatusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  projectEndDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
  },
  endDateIcon: {
    marginRight: 4,
  },
  projectEndDate: {
    fontSize: 14,
    color: "#666",
  },
  noProjectsText: {
    fontSize: 14,
    color: "#666",
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default SelectYourProject;
