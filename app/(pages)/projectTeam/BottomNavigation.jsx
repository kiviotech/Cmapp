import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { logout } from "../../../src/utils/auth";

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check unread count every 1 second
    const interval = setInterval(() => {
      setUnreadCount(global.unreadNotificationsCount || 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        onPress={() => navigation.navigate("(pages)/projectTeam/Myactivity")}
      >
        <Icon
          name={
            route.name === "(pages)/projectTeam/Myactivity"
              ? "bar-chart"
              : "bar-chart-outline"
          }
          size={24}
          color={
            route.name === "(pages)/projectTeam/Myactivity"
              ? "#577CFF"
              : "#A8A8A8"
          }
        />
        <Text
          style={
            route.name === "(pages)/projectTeam/Myactivity"
              ? styles.navTextActive
              : styles.navText
          }
        >
          My Activity
        </Text>
      </TouchableOpacity>

      {/* Projects */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("(pages)/projectTeam/ProjectList")}
      >
        <Icon
          name={
            route.name === "(pages)/projectTeam/ProjectList"
              ? "folder"
              : "folder-outline"
          }
          size={24}
          color={
            route.name === "(pages)/projectTeam/ProjectList"
              ? "#577CFF"
              : "#A8A8A8"
          }
        />
        <Text
          style={
            route.name === "(pages)/projectTeam/ProjectList"
              ? styles.navTextActive
              : styles.navText
          }
        >
          Projects
        </Text>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("(pages)/projectTeam/Notification")}
      >
        <View>
          <Icon
            name={
              route.name === "(pages)/projectTeam/Notification"
                ? "notifications"
                : "notifications-outline"
            }
            size={24}
            color={
              route.name === "(pages)/projectTeam/Notification"
                ? "#577CFF"
                : "#A8A8A8"
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
            route.name === "(pages)/projectTeam/Notification"
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
          navigation.navigate("(pages)/projectTeam/ProfileScreen");
        }}
      >
        <Icon
          name="person-outline" // Change this to the profile icon
          size={24}
          color={
            route.name === "(pages)/projectTeam/ProfileScreen"
              ? "#577CFF"
              : "#A8A8A8"
          }
        />
        <Text
          style={
            route.name === "(pages)/projectTeam/ProfileScreen"
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
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default BottomNavigation;
