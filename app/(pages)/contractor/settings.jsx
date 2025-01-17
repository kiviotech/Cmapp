import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
// import BottomNavigation from "./BottomNavigation";
import BottomNavigation from "./BottomNavigation ";
import { logout } from "../../../src/utils/auth";
import useAuthStore from "../../../useAuthStore";
import { useNavigation, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const Settings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigation = useNavigation();

  const handleLogout = () => {
    clearAuth();
    router.replace("(auth)/login");
    setIsModalVisible(false);
    logout();
  };

  const showLogoutPopup = () => {
    setIsModalVisible(true);
  };

  const closeLogoutModal = () => {
    setIsModalVisible(false);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView>
        <Text style={styles.sectionTitle}>My Account</Text>
        <View
          style={[
            styles.section,
            { borderBottomWidth: 1, borderBottomColor: "#CACACA" },
          ]}
        >
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("(pages)/contractor/PersonalDetailsScreen")
              }
            >
              <Text style={styles.itemText}>Personal details</Text>
              <FontAwesome
                style={{ color: colors.blackColor }}
                name="chevron-right"
                size={15}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("(pages)/ChangePassword")}
            >
              <Text style={styles.itemText}>Change password</Text>
              <FontAwesome
                style={{ color: colors.blackColor }}
                name="chevron-right"
                size={15}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.innerContainer}>
          <View style={styles.item}>
            <Text style={styles.itemText}>Push notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#0066FF" }}
              thumbColor={colors.whiteColor}
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.switch}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>More</Text>
        <View style={styles.section}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => showInfoModal("About us")}
            >
              <Text style={styles.itemText}>About us</Text>
              <FontAwesome
                style={{ color: colors.blackColor }}
                name="chevron-right"
                size={15}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => showInfoModal("Privacy policy")}
            >
              <Text style={styles.itemText}>Privacy policy</Text>
              <FontAwesome
                style={{ color: colors.blackColor }}
                name="chevron-right"
                size={15}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => showInfoModal("Terms and conditions")}
            >
              <Text style={styles.itemText}>Terms and conditions</Text>
              <FontAwesome
                style={{ color: colors.blackColor }}
                name="chevron-right"
                size={15}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={showLogoutPopup}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation />

      {/* Logout Confirmation Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeLogoutModal}
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
                onPress={closeLogoutModal}
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

      {/* Info Modal for "About us", "Privacy policy", "Terms and conditions" */}
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

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.whiteColor,
    marginBottom: 20,
    borderRadius: 15,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 15,
    color: "#000",
    fontWeight: "600",
  },
  innerContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  itemText: {
    fontSize: 16,
    color: colors.blackColor,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.whiteColor,
    marginHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    marginLeft: 8,
  },
  switch: {
    transform: [{ scale: 0.8 }],
  },

  // Modal Styles
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
    color: colors.blackColor,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666666",
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
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.blackColor,
  },
});
