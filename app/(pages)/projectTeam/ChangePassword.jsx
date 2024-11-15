import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../../src/api/apiClient"
import useAuthStore from "../../../useAuthStore";

const ChangePassword = () => {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [validation, setValidation] = useState({
    minLength: false,
    hasNumber: false,
    noSpaces: true,
    hasUpperLower: false,
  });

  const handlePasswordChange = (password) => {
    setNewPassword(password);
    setValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      noSpaces: !/\s/.test(password),
      hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    });
  };

  const handleSubmit = async () => {
    if (
      newPassword === confirmPassword &&
      validation.minLength &&
      validation.hasNumber &&
      validation.noSpaces &&
      validation.hasUpperLower
    ) {
      try {
        const token = user.jwt; // Assuming the JWT token is stored in the user state
        const response = await apiClient.post(
          "/auth/change-password",
          {
            currentPassword,
            password: newPassword,
            passwordConfirmation: confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Use the correct token from the user state
            },
          }
        );

        if (response.status === 200) {
          alert("Password updated successfully!");
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');

          // navigation.goBack();
        } else {
          alert(response.data?.error?.message || "Failed to update password.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while updating the password.");
      }
    } else {
      alert("Please ensure all requirements are met.");
    }
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.headerText}>Change Password</Text>
          </View>
          <Text style={styles.subHeader}>
            The new password must be different from current password
          </Text>

          <Text style={styles.label}>Current Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry={!isCurrentPasswordVisible}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
              onPress={() =>
                setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
              }
            >
              <Icon
                name={
                  isCurrentPasswordVisible ? "visibility" : "visibility-off"
                }
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={!isNewPasswordVisible}
              value={newPassword}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity
              onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
            >
              <Icon
                name={isNewPasswordVisible ? "visibility" : "visibility-off"}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry={!isConfirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <Icon
                name={
                  isConfirmPasswordVisible ? "visibility" : "visibility-off"
                }
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.validationContainer}>
            <View style={styles.validationItem}>
              <Icon
                name={validation.minLength ? "check-circle" : "cancel"}
                size={20}
                color={validation.minLength ? "green" : "red"}
              />
              <Text
                style={validation.minLength ? styles.valid : styles.invalid}
              >
                Must contain at least 8 characters
              </Text>
            </View>
            <View style={styles.validationItem}>
              <Icon
                name={validation.hasNumber ? "check-circle" : "cancel"}
                size={20}
                color={validation.hasNumber ? "green" : "red"}
              />
              <Text
                style={validation.hasNumber ? styles.valid : styles.invalid}
              >
                Must contain at least a number
              </Text>
            </View>
            <View style={styles.validationItem}>
              <Icon
                name={validation.noSpaces ? "check-circle" : "cancel"}
                size={20}
                color={validation.noSpaces ? "green" : "red"}
              />
              <Text style={validation.noSpaces ? styles.valid : styles.invalid}>
                There should be no spaces
              </Text>
            </View>
            <View style={styles.validationItem}>
              <Icon
                name={validation.hasUpperLower ? "check-circle" : "cancel"}
                size={20}
                color={validation.hasUpperLower ? "green" : "red"}
              />
              <Text
                style={validation.hasUpperLower ? styles.valid : styles.invalid}
              >
                Must contain at least one uppercase and one lowercase letter
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* <BottomNavigation /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    backgroundColor: '#fff',
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginLeft: 80,
  },
  subHeader: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
    fontWeight: "bold",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  validationContainer: {
    marginVertical: 15,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  valid: {
    color: "green",
    fontSize: 12,
    marginLeft: 5,
  },
  invalid: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginLeft: 25,
    marginBottom: 10,
    height: 50,
    width: 150,
    left: 95,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelButton: {
    alignItems: "center",
  },
  cancelText: {
    color: "#888",
    fontWeight: "bold",
  },
});

export default ChangePassword;
