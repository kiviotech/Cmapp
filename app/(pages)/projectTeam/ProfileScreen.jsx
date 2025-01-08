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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation";
import { logout } from "../../../src/utils/auth";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../useAuthStore";

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const navigation = useNavigation();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const showLogoutPopup = () => {
    setIsModalVisible(true);
  };

  const handleLogout = () => {
    logout();
    clearAuth();
    navigation.navigate("(auth)/login");
    setIsModalVisible(false);
    Alert.alert("Logged Out", "You have been logged out successfully.");
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const showErrorModal = (title) => {
    console.log("error title", errorTitle);
    setErrorTitle(title); // Set the specific title passed in
    setIsErrorModalVisible(true);
  };

  const closeErrorModal = () => {
    setIsErrorModalVisible(false);
    setErrorTitle(""); // Clear errorTitle when closing the modal
  };
  const showInfoModal = (title) => {
    setInfoModalTitle(title);
    setIsInfoModalVisible(true);
  };
  const closeInfoModal = () => {
    setIsInfoModalVisible(false);
    setInfoModalTitle("");
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>My Account</Text>
        <View style={styles.sectionContainer}>
          <ProfileItem
            title="Personal details"
            onPress={() =>
              navigation.navigate("(pages)/projectTeam/PersonalDetails")
            }
          />
          <ProfileItem
            title="Change password"
            onPress={() =>
              navigation.navigate("(pages)/ChangePassword")
            }
          />
          <ProfileItem
            title="My Activity"
            onPress={() => {
              navigation.navigate("(pages)/projectTeam/Myactivity");
            }}
          />
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
          <ProfileItem
            title="About us"
            // onPress={() => showErrorModal("About us")}
            onPress={() => showInfoModal("About us")}
          />
          <ProfileItem
            title="Privacy policy"
            // onPress={() => showErrorModal("Privacy policy")}
            onPress={() => showInfoModal("Privacy policy")}
          />
          <ProfileItem
            title="Terms and conditions"
            // onPress={() => showErrorModal("Terms and Conditions")}
            onPress={() => showInfoModal("Terms and conditions")}
          />
        </View>

        {/* Trigger the popup modal instead of directly logging out */}
        <TouchableOpacity style={styles.logoutButton} onPress={showLogoutPopup}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        <BottomNavigation />
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={handleLogout}
              >
                <Text style={styles.proceedButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isInfoModalVisible}
        animationType="fade"
        onRequestClose={closeInfoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{infoModalTitle}</Text>
            <Text style={styles.modalMessage}>
              This section is currently unavailable. Please try again later.
            </Text>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={closeInfoModal}
            >
              <Text style={styles.infoModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const ProfileItem = ({ title, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Text style={styles.itemText}>{title}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color="#C7C7CC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 100, // Increased padding to account for bottom navigation
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 20,
    height: 800,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    paddingTop: 40,
    zIndex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
  },
  proceedButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  proceedButtonText: {
    fontSize: 16,
    color: "white",
  },

  infoModalButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  infoModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorModalButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  errorModalButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default ProfileScreen;