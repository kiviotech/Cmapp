import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { logout } from "../../../src/utils/auth";
import useAuthStore from "../../../useAuthStore";
import { fetchSubmissionByUserId } from "../../../src/services/submissionService";

const BottomNavigation = ({ unreadCount: propUnreadCount }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(propUnreadCount);

  useEffect(() => {
    const getUnreadCount = async () => {
      if (user && user.id) {
        try {
          const submissionResponse = await fetchSubmissionByUserId(user.id);
          const unreadNotifications = submissionResponse.data.filter(
            (sub) => sub?.attributes?.notification_status === "unread"
          );
          setUnreadCount(unreadNotifications.length);
        } catch (error) {
          console.error("Error fetching unread count:", error);
        }
      }
    };

    getUnreadCount();
  }, [user, route.name]);

  return (
    <View style={styles.navContainer}>
      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("(pages)/dashboard")}
      >
        <Icon
          name={route.name === "(pages)/dashboard" ? "home" : "home-outline"}
          size={24}
          color={route.name === "(pages)/dashboard" ? "#577CFF" : "#A8A8A8"}
        />
        <Text
          style={
            route.name === "(pages)/dashboard"
              ? styles.navTextActive
              : styles.navText
          }
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* My Activity */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          navigation.navigate("(pages)/contractor/profile");
        }}
      >
        <Icon
          name={
            route.name === "(pages)/contractor/profile"
              ? "bar-chart"
              : "bar-chart-outline"
          }
          size={24}
          color={
            route.name === "(pages)/contractor/profile" ? "#577CFF" : "#A8A8A8"
          }
        />
        <Text
          style={
            route.name === "(pages)/contractor/profile"
              ? styles.navTextActive
              : styles.navText
          }
        >
          My Activity
        </Text>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("(pages)/notification")}
      >
        <View>
          <Icon
            name={
              route.name === "(pages)/notification"
                ? "notifications"
                : "notifications-outline"
            }
            size={24}
            color={
              route.name === "(pages)/notification" ? "#577CFF" : "#A8A8A8"
            }
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={
            route.name === "(pages)/notification"
              ? styles.navTextActive
              : styles.navText
          }
        >
          Notifications
        </Text>
      </TouchableOpacity>

      {/* Profile / Logout */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          navigation.navigate("(pages)/contractor/settings");
        }}
      >
        <Icon
          name="person-outline" // Change this to the profile icon
          size={24}
          color={
            route.name === "(pages)/contractor/settings" ? "#577CFF" : "#A8A8A8"
          }
        />
        <Text
          style={
            route.name === "(pages)/contractor/settings"
              ? styles.navTextActive
              : styles.navText
          }
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DADADA",
    paddingVertical: 15,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
  navTextActive: {
    color: "#577CFF",
    fontSize: 12,
    marginTop: 6,
  },
  navText: {
    color: "#A8A8A8",
    fontSize: 12,
    marginTop: 6,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default BottomNavigation;
