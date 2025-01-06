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
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../useAuthStore";

const { width, height } = Dimensions.get("window");

const Settings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const navigation = useNavigation();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    logout();
    clearAuth();
    navigation.navigate("(auth)/login");
    setIsModalVisible(false);
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
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        <View
          style={[
            styles.section,
            { borderBottomWidth: 1, borderBottomColor: "#CACACA" },
          ]}
        >
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("(pages)/contractor/PersonalDetailsScreen")
            }
          >
            <Text style={styles.itemText}>Edit profile</Text>
            <FontAwesome
              style={{ color: colors.blackColor }}
              name="chevron-right"
              size={15}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("(pages)/ChangePassword")
            }
          >
            <Text style={styles.itemText}>Change password</Text>
            <FontAwesome
              style={{ color: colors.blackColor }}
              name="chevron-right"
              size={15}
            />
          </TouchableOpacity>

          <View style={styles.item}>
            <Text style={styles.itemText}>Push notifications</Text>
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={isEnabled ? colors.whiteColor : colors.whiteColor}
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={styles.switch}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>

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

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={showLogoutPopup}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.05,
    backgroundColor: colors.background,
    paddingBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: colors.blackColor,
  },
  section: {
    marginBottom: height * 0.03,
    paddingBottom: height * 0.015,
  },
  switchContainer: {
    height: height * 0.06,
    justifyContent: "center",
    paddingRight: width * 0.05,
  },
  switch: {
    transform: [{ scale: 1.5 }],
  },
  sectionTitle: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
    color: "#ADADAD",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.018,
  },
  itemText: {
    fontSize: width * 0.045,
    color: colors.blackColor,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: height * 0.015,
    borderRadius: 10,
    marginTop: height * 0.02,
  },
  logoutText: {
    fontSize: width * 0.045,
    color: "#FF3B30",
    marginLeft: width * 0.02,
    fontWeight: "bold",
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
});
