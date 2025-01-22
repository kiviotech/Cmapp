import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchRegistrations } from "../../src/services/registrationService";
import { fetchSubmissions } from "../../src/services/submissionService";

const { width, height } = Dimensions.get("window");

const RequestsScreen = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [activeCategory, setActiveCategory] = useState("Submission");
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [registrationsResponse, submissionsResponse] =
            await Promise.all([fetchRegistrations(), fetchSubmissions()]);

          const registrations = registrationsResponse?.data || [];
          const submissions = submissionsResponse?.data || [];
          setRequests([...registrations, ...submissions]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, [])
  );

  const filteredRequests = requests.filter((request) => {
    const isStatusMatch = request.attributes.status === activeTab.toLowerCase();
    const isCategoryMatch =
      (activeCategory === "Registration" && request.attributes.email) ||
      (activeCategory === "Submission" && request.attributes.comment);

    const searchText = searchQuery.toLowerCase();

    // For Registration requests - search by username
    if (activeCategory === "Registration") {
      const username = request.attributes.username?.toLowerCase() || "";
      return isStatusMatch && isCategoryMatch && username.includes(searchText);
    }

    // For Submission requests - search by project name and task name
    const projectName =
      request.attributes.task?.data?.attributes?.project?.data?.attributes.name?.toLowerCase() ||
      "";
    const taskName =
      request.attributes.task?.data?.attributes?.standard_task?.data?.attributes?.Name?.toLowerCase() ||
      "";
    const searchString = `Submission for ${projectName} - ${taskName}`;

    return (
      isStatusMatch && isCategoryMatch && searchString.includes(searchText)
    );
  });

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestContainer}>
      {item.attributes.email ? (
        <Text style={styles.requestTitle}>
          New Registration Request from {item?.attributes?.username}
        </Text>
      ) : (
        <Text style={styles.requestTitle}>
          Submission for{" "}
          {item.attributes.task?.data?.attributes?.project?.data?.attributes
            .name || "Project"}
          {" - "}
          {item?.attributes?.task?.data?.attributes?.standard_task?.data
            ?.attributes?.Name || "Work"}
        </Text>
      )}
      {item.attributes.comment && (
        <Text style={styles.requestDescription}>
          {item?.attributes?.comment}
        </Text>
      )}
      <Text
        style={[
          styles.requestStatus,
          styles[
            `status${
              item.attributes.status.charAt(0).toUpperCase() +
              item.attributes.status.slice(1)
            }`
          ],
        ]}
      >
        Status:{" "}
        {item?.attributes?.status.charAt(0).toUpperCase() +
          item?.attributes?.status.slice(1).toLowerCase()}
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            activeCategory === "Submission"
              ? "(pages)/TaskRequestDetails"
              : "(pages)/EmailRequestDetails",
            { requestData: item }
          )
        }
      >
        <Text style={styles.viewButton}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Requests</Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabsContainer}>
          {["Submission", "Registration"].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                activeCategory === category && styles.activeCategoryTab,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCategory === category && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status Tabs */}
        <View style={styles.tabsContainer}>
          {["Approved", "Pending", "Rejected"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search requests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      {filteredRequests.length > 0 ? (
        <FlatList
          data={[...filteredRequests].reverse()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRequestItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No requests found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  fixedHeader: {
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    paddingTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 20,
    marginTop: -5,
  },
  categoryTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: "50%",
  },
  activeCategoryTab: {
    borderColor: "#577CFF",
    borderBottomWidth: 6,
    borderBottomColor: "#577CFF",
  },
  activeCategoryText: {
    color: "#577CFF",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#577CFF",
  },
  activeTab: {
    backgroundColor: "#577CFF",
    borderColor: "#577CFF",
  },
  tabText: {
    color: "#577CFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  requestContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 14,
    color: "#666",
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  statusPending: {
    color: "#ED8936",
  },
  statusApproved: {
    color: "#38A169",
  },
  statusRejected: {
    color: "#E53E3E",
  },
  viewButton: {
    color: "#3182CE",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
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
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default RequestsScreen;
