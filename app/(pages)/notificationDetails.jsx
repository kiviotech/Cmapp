import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const NotificationDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { notification, task, formattedTime, statusColor } = params;

  // Parse the JSON strings back to objects if needed
  const notificationData =
    typeof notification === "string" ? JSON.parse(notification) : notification;
  const taskData = typeof task === "string" ? JSON.parse(task) : task;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.projectName}>
            {taskData?.attributes?.project?.data?.attributes?.name}
          </Text>
          <Text style={styles.timestamp}>{formattedTime}</Text>

          <View style={styles.statusContainer}>
            <Text style={[styles.status, { color: statusColor }]}>
              {notificationData.attributes.status?.charAt(0).toUpperCase() +
                notificationData.attributes.status?.slice(1) || "Pending"}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Comment</Text>
          <Text style={styles.comment}>
            {notificationData.attributes.comment || "No additional information"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  comment: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});

export default NotificationDetails;
