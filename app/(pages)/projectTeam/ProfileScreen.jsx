import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation";
import { logout } from "../../../src/utils/auth";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../useAuthStore";

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const navigation = useNavigation();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    logout();
    clearAuth();
    navigation.navigate("(auth)/login");
    Alert.alert("Logged Out", "You have been logged out successfully.");
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerText}>Profile</Text>

          <Text style={styles.sectionHeader}>My Account</Text>
          <View style={styles.sectionContainer}>
            <ProfileItem title="Personal details" />
            <ProfileItem title="Change password" />
            <ProfileItem title="My Activity" />
          </View>

          <Text style={styles.sectionHeader}>Settings</Text>
          <View style={styles.sectionContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Push notifications</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>

          <Text style={styles.sectionHeader}>More</Text>
          <View style={styles.sectionContainer}>
            <ProfileItem title="About us" />
            <ProfileItem title="Privacy policy" />
            <ProfileItem title="Terms and conditions" />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const ProfileItem = ({ title }) => (
  <TouchableOpacity style={styles.itemContainer}>
    <Text style={styles.itemText}>{title}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color="#C7C7CC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 20,
    height: 800,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginVertical: 10,
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  itemText: {
    fontSize: 16,
    color: "#1C1C1E",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
