import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
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
import { useFocusEffect } from "@react-navigation/native";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("Unread");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const navigation = useNavigation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "" });
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

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

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // Function to update notification status to "read"
  const markAsRead = async (item) => {
    try {
      const isRegistration = !!item.attributes.email;
      const payload = { data: { notification_status: "read" } };

      if (isRegistration) {
        await updateExistingRegistration(item.id, payload);
      } else {
        await updateExistingSubmission(item.id, payload);
      }

      // Update the local state immediately
      setUnreadNotifications((prev) =>
        prev.filter((notification) => notification.id !== item.id)
      );
      setReadNotifications((prev) => [
        {
          ...item,
          attributes: {
            ...item.attributes,
            notification_status: "read",
            status: item.attributes.status, // Preserve the existing status
          },
        },
        ...prev,
      ]);

      // Navigate to the appropriate details screen
      navigation.navigate(
        isRegistration
          ? "(pages)/EmailRequestDetails"
          : "(pages)/TaskRequestDetails",
        {
          requestData: item,
          source: "notification",
          onStatusUpdate: async (newStatus) => {
            // This callback will be called when the status is updated in the details screen
            await fetchData(); // Refresh the data when returning
          },
        }
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };
  const renderNotificationItem = ({ item }) => {
    const isRegistration = !!item.attributes.email;
    const notificationTitle = isRegistration
      ? `Registration Request from ${item.attributes.username}`
      : `Submission for ${
          item.attributes.task?.data?.attributes?.project?.data?.attributes
            ?.name || "Project"
        }`;

    const createdAt = new Date(item.attributes.createdAt);
    const formattedTime = createdAt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add status display
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
            <View style={styles.titleRow}>
              <Text style={styles.title}>{notificationTitle}</Text>
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

  // Add filtered notifications logic
  const filteredNotifications = (notifications) => {
    const searchText = searchQuery.toLowerCase();
    return notifications.filter((item) => {
      const username = item.attributes.username?.toLowerCase() || "";
      const comment = item.attributes.comment?.toLowerCase() || "";
      const projectName =
        item.attributes.task?.data?.attributes?.project?.data?.attributes?.name?.toLowerCase() ||
        "";

      return (
        searchText === "" ||
        username.includes(searchText) ||
        comment.includes(searchText) ||
        projectName.includes(searchText)
      );
    });
  };

  const showToast = ({ title, message }) => {
    setToastMessage({ title, message });
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2700),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastVisible(false);
    });
  };

  const CustomToast = () => (
    <Animated.View
      style={[
        toastStyles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={toastStyles.content}>
        <Text style={toastStyles.title}>{toastMessage.title}</Text>
        <Text style={toastStyles.message}>{toastMessage.message}</Text>
      </View>
    </Animated.View>
  );

  // Modify the useFocusEffect to handle both status updates and notification status
  useFocusEffect(
    React.useCallback(() => {
      const checkUpdates = async () => {
        try {
          // Get status update from navigation params
          const statusUpdate = navigation
            .getState()
            ?.routes?.find(
              (route) => route.name === "(pages)/projectTeam/Notification"
            )?.params?.statusUpdate;

          // Fetch fresh data
          await fetchData();

          // Show toast if there's a status update
          if (statusUpdate) {
            showToast({
              title: "Status Updated",
              message: `Request has been ${statusUpdate.status}`,
            });
            navigation.setParams({ statusUpdate: null });
          }
        } catch (error) {
          console.error("Error checking updates:", error);
        }
      };

      checkUpdates();
    }, [navigation])
  );

  // Add this after the fetchData function
  useEffect(() => {
    // Update global unread count whenever unreadNotifications changes
    global.unreadNotificationsCount = unreadNotifications.length;
  }, [unreadNotifications]);

  return (
    <SafeAreaView style={styles.areaContainer}>
      {toastVisible && <CustomToast />}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
        </View>

        {/* Tabs First */}
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

        {/* Search Bar After Tabs */}
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

      {/* Single FlatList based on active tab */}
      <FlatList
        data={filteredNotifications(
          activeTab === "Unread" ? unreadNotifications : readNotifications
        ).sort(
          (a, b) =>
            new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
        )}
        keyExtractor={(item, index) => {
          const prefix = item.attributes.email ? "reg" : "sub";
          return `${activeTab.toLowerCase()}-${prefix}-${item.id}-${index}`;
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

const toastStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  content: {
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
});

export default Notification;