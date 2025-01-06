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
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "./BottomNavigation";
import {
  fetchRegistrations,
  updateExistingRegistration,
} from "../../../src/services/registrationService";
import {
  fetchSubmissions,
  updateExistingSubmission,
} from "../../../src/services/submissionService";

const Notification = () => {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrationsResponse, submissionsResponse] = await Promise.all([
          fetchRegistrations(),
          fetchSubmissions(),
        ]);

        const registrations = registrationsResponse?.data || [];
        const submissions = submissionsResponse?.data || [];
        const combinedNotifications = [...registrations, ...submissions];

        const unread = combinedNotifications.filter(
          (item) => item.attributes.notification_status === "unread"
        );
        const read = combinedNotifications.filter(
          (item) => item.attributes.notification_status === "read"
        );

        setUnreadNotifications(unread);
        setReadNotifications(read);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchData();
  }, []);

  // Function to update notification status to "read"
  const markAsRead = async (item) => {
    try {
      const isRegistration = !!item.attributes.email;
      const payload = { data: { notification_status: "read" } }; // Updated payload structure

      if (isRegistration) {
        await updateExistingRegistration(item.id, payload);
      } else {
        await updateExistingSubmission(item.id, payload);
      }

      // Update the state to reflect the change
      setUnreadNotifications((prev) =>
        prev.filter((notification) => notification.id !== item.id)
      );
      setReadNotifications((prev) => [
        ...prev,
        {
          ...item,
          attributes: { ...item.attributes, notification_status: "read" },
        },
      ]);
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };
  const renderNotificationItem = ({ item }) => {
    const isRegistration = !!item.attributes.email;
    const notificationTitle = isRegistration
      ? `Registration Request from ${item.attributes.username}`
      : `Submission for ${item.attributes.task?.data?.attributes?.project?.data?.attributes
        ?.name || "Project"
      }`;

    return (
      <TouchableOpacity
        onPress={() => {
          markAsRead(item); // Mark the notification as read on click
          navigation.navigate(
            isRegistration
              ? "(pages)/EmailRequestDetails"
              : "(pages)/TaskRequestDetails",
            {
              requestData: item,
              source: "notification",
            }
          );
        }}
      >
        <View style={styles.notificationContainer}>
          <Ionicons
            name={isRegistration ? "mail-outline" : "document-text-outline"}
            size={24}
            color="#4CAF50"
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{notificationTitle}</Text>
            <Text style={styles.message}>
              {item.attributes.comment || "No additional information"}
            </Text>
          </View>
          <Text style={styles.time}>Status: {item.attributes.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.areaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
        </View>
      </View>

      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>Unread</Text>
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{unreadNotifications.length}</Text>
        </View>
      </View>
      <FlatList
        data={unreadNotifications}
        keyExtractor={(item) => {
          // Ensure unique key by combining registration and submission ids
          const prefix = item.attributes.email ? 'reg-' : 'sub-';
          return `${prefix}${item.id}`;
        }}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>Read</Text>
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{readNotifications.length}</Text>
        </View>
      </View>
      <FlatList
        data={readNotifications}
        keyExtractor={(item) => {
          // Ensure unique key by combining registration and submission ids
          const prefix = item.attributes.email ? 'reg-' : 'sub-';
          return `${prefix}${item.id}`;
        }}
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
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginRight: 8,
  },
  countBubble: {
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  countText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: 14,
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
