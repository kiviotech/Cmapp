import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchRegistrations } from "../../src/services/registrationService";
import { fetchSubmissions } from "../../src/services/submissionService";

const RequestsScreen = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [activeCategory, setActiveCategory] = useState("Task");
  const [requests, setRequests] = useState([]);
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
      (activeCategory === "Email" && request.attributes.email) ||
      (activeCategory === "Task" && request.attributes.comment);
    return isStatusMatch && isCategoryMatch;
  });

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestContainer}>
      {item.attributes.email ? (
        <Text style={styles.requestTitle}>
          New Registration Request from {item.attributes.username}
        </Text>
      ) : (
        <Text style={styles.requestTitle}>Submitted Project Work</Text>
      )}
      {item.attributes.comment && (
        <Text style={styles.requestDescription}>{item.attributes.comment}</Text>
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
        Status: {item.attributes.status}
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            activeCategory === "Task"
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
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>Requests</Text>
          {/* Category Tabs */}
          <View style={styles.categoryTabsContainer}>
            {["Task", "Email"].map((category) => (
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
                    activeCategory === category && styles.activeTabText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Status Tabs */}
          <View style={styles.tabsContainer}>
            {["Approved", "Pending", "Declined"].map((tab) => (
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
          <FlatList
            data={filteredRequests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRequestItem}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  categoryTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#577CFF",
  },
  activeCategoryTab: {
    backgroundColor: "#577CFF",
    borderColor: "#577CFF",
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
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 16,
  },
  requestContainer: {
    padding: 16,
    backgroundColor: "#F8F8F8",
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
  statusDeclined: {
    color: "#E53E3E",
  },
  viewButton: {
    color: "#3182CE",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default RequestsScreen;
