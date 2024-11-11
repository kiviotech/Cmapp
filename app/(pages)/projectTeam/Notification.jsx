import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation";
import { fetchRegistrations } from "../../../src/services/registrationService";
import { fetchSubmissions } from "../../../src/services/submissionService";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrationsResponse, submissionsResponse] = await Promise.all([
          fetchRegistrations(),
          fetchSubmissions(),
        ]);

        const registrations = registrationsResponse?.data || [];
        const submissions = submissionsResponse?.data || [];
        setNotifications([...registrations, ...submissions]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchData();
  }, []);

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Ionicons
        name={item.attributes.email ? "mail-outline" : "document-text-outline"}
        size={24}
        color="#4CAF50"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {item.attributes.email
            ? `Registration Request from ${item.attributes.username}`
            : `Submission for ${
                item.attributes.task?.data?.attributes?.project?.data
                  ?.attributes?.name || "Project"
              }`}
        </Text>
        <Text style={styles.message}>
          {item.attributes.comment || "No additional information"}
        </Text>
      </View>
      <Text style={styles.time}>Status: {item.attributes.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.areaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
          {/* <Ionicons name="search-outline" size={24} color="black" /> */}
        </View>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 10,
    // elevation: 3,
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 18,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  message: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default Notification;
