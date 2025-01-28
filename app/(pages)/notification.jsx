import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "./contractor/BottomNavigation ";
import { getTaskByContractorId } from "../../src/api/repositories/taskRepository";
import { fetchContractorsByUserId } from "../../src/services/contractorService";
import useAuthStore from "../../useAuthStore";
import { fetchSubmissionByUserId, updateExistingSubmission } from "../../src/services/submissionService";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("Unread");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const navigation = useNavigation();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        try {
          setIsLoading(true);

          const submissionResponse = await fetchSubmissionByUserId(user.id);

          const taskData = submissionResponse?.data?.map((submission) => submission?.attributes?.task?.data)

          const unread = [];
          const read = [];

          unread.push(
            ...submissionResponse.data.filter(
              (sub) => sub?.attributes?.notification_status === "unread"
            )
          );
          read.push(
            ...submissionResponse.data.filter(
              (sub) => sub?.attributes?.notification_status === "read"
            )
          );

          setSubmissions(submissionResponse?.data);
          setTasks(taskData)
          setUnreadNotifications(unread);
          setReadNotifications(read);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const markAsRead = async (item) => {
    try {
      // Only update the notification status if it's currently unread
      if (item.attributes.notification_status === "unread") {
        // Update the notification status using the submission service
        await updateExistingSubmission(item.id, {
          data: {
            notification_status: "read",
          },
        });

        // Update local state
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
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const renderNotificationItem = ({ item }) => {
    console.log('item', item)
    const task = tasks.find((t) =>
      t.attributes.submissions.data.some((s) => s.id === item.id)
    );

    const createdAt = new Date(item.attributes.createdAt);
    const formattedTime = createdAt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const status = item.attributes.status || "pending";
    const statusColor =
      {
        approved: "#4CAF50",
        rejected: "#FF4444",
        pending: "#FFA500",
      }[status.toLowerCase()] || "#6C757D";

    return (
      <TouchableOpacity
        onPress={() => {
          markAsRead(item);
          navigation.navigate("(pages)/notificationDetails", {
            notification: JSON.stringify(item),
            task: JSON.stringify(task),
            formattedTime,
            statusColor,
          });
        }}
      >
        <View style={styles.notificationContainer}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color="#4CAF50"
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                Submission for{" "}
                {task?.attributes?.project?.data?.attributes?.name}
              </Text>
              <Text style={styles.time}>{formattedTime}</Text>
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.message}>
                {item.attributes.comment || "No additional information"}
              </Text>
              <Text style={[styles.status, { color: statusColor }]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredNotifications = (notifications) => {
    const searchText = searchQuery.toLowerCase();
    return notifications.filter((item) => {
      const comment = item.attributes.comment?.toLowerCase() || "";
      const task = tasks.find((t) =>
        t.attributes.submissions.data.some((s) => s.id === item.id)
      );
      const projectName =
        task?.attributes?.project?.data?.attributes?.name?.toLowerCase() || "";

      return (
        searchText === "" ||
        comment.includes(searchText) ||
        projectName.includes(searchText)
      );
    });
  };

  return (
    <SafeAreaView style={styles.areaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
        </View>

        <View style={styles.categoryTabsContainer}>
          {["Unread", "Read"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.categoryTab,
                activeTab === tab && styles.activeCategoryTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  activeTab === tab && styles.activeCategoryText,
                ]}
              >
                {tab} (
                {tab === "Unread"
                  ? unreadNotifications.length
                  : readNotifications.length}
                )
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notifications..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredNotifications(
          activeTab === "Unread" ? unreadNotifications : readNotifications
        ).sort(
          (a, b) =>
            new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
        )}
        keyExtractor={(item, index) => `notification-${item.id}-${index}`}
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  message: {
    fontSize: 14,
    color: "#6C757D",
    flex: 1,
    marginRight: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 80,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
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
  categoryTabText: {
    color: "#1C1C1E",
    fontWeight: "bold",
    textAlign: "center",
  },
  activeCategoryText: {
    color: "#577CFF",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
});

export default Notification;
