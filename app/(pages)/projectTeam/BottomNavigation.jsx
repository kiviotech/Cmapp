import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { logout } from "../../../src/utils/auth";

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

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
        // onPress={() => navigation.navigate("(pages)/profile")}
      >
        <Icon
          name={
            route.name === "(pages)/profile" ? "bar-chart" : "bar-chart-outline"
          }
          size={24}
          color={route.name === "(pages)/profile" ? "#577CFF" : "#A8A8A8"}
        />
        <Text
          style={
            route.name === "(pages)/profile"
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
        onPress={() => navigation.navigate("(pages)/notifications")}
      >
        <Icon
          name={
            route.name === "(pages)/notifications"
              ? "notifications"
              : "notifications-outline"
          }
          size={24}
          color={route.name === "(pages)/notifications" ? "#577CFF" : "#A8A8A8"}
        />
        <Text
          style={
            route.name === "(pages)/notifications"
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
          logout(); // Call the logout function
          // navigation.navigate("(pages)/profile");
        }}
      >
        <Icon
          name="person-outline" // Change this to the profile icon
          size={24}
          color={route.name === "(pages)/profile" ? "#577CFF" : "#A8A8A8"}
        />
        <Text
          style={
            route.name === "(pages)/profile"
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
});

export default BottomNavigation;
