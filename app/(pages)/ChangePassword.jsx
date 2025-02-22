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
import Icon from "react-native-vector-icons/MaterialIcons"; // Make sure to install and link react-native-vector-icons
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import useAuthStore from "../../useAuthStore";
import apiClient from "../../src/api/apiClient";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [errors, setErrors] = useState("");
  const { user, token } = useAuthStore();

  const [validation, setValidation] = useState({
    minLength: false,
    hasNumber: false,
    noSpaces: true,
    hasUpperLower: false,
  });

  const navigation = useNavigation();

  // Function to check if all fields are filled
  const checkFields = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrors("Please fill in all the fields.");
    } else if (newPassword != confirmPassword) {
      setErrors("New password and Confirm password should be same");
    } else {
      setErrors(""); // Clear error if all fields are filled
    }
  };

  // Update these handlers to prevent spaces
  const handleCurrentPassword = (text) => {
    const noSpaces = text.replace(/\s/g, "");
    setCurrentPassword(noSpaces);
  };

  const handlePasswordChange = (text) => {
    const noSpaces = text.replace(/\s/g, "");
    setNewPassword(noSpaces);
    setValidation({
      minLength: noSpaces.length >= 8,
      hasNumber: /\d/.test(noSpaces),
      noSpaces: true, // This will always be true now
      hasUpperLower: /[a-z]/.test(noSpaces) && /[A-Z]/.test(noSpaces),
    });
  };

  const handleConfirmPassword = (text) => {
    const noSpaces = text.replace(/\s/g, "");
    setConfirmPassword(noSpaces);
  };

  const handleSubmit = async () => {
    checkFields();
    if (newPassword != confirmPassword) {
      setErrors("New password and Confirm password should be same");
    }
    if (
      newPassword === confirmPassword &&
      validation.minLength &&
      validation.hasNumber &&
      validation.noSpaces &&
      validation.hasUpperLower
    ) {
      try {
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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Password updated successfully!");
          navigation.goBack();
        } else {
          alert(response.data.error?.message || "Failed to update password.");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrors("The current password is invalid.");
          alert("Check the current password.");
        } else {
          alert("Please ensure all requirements are met.");
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Change Password</Text>
          </View>
          <Text style={styles.subHeader}>
            The new password must be different from current password
          </Text>

          {errors && <Text style={styles.errorText}>{errors}</Text>}

          <Text style={styles.label}>Current Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry={!isCurrentPasswordVisible}
              value={currentPassword}
              onChangeText={handleCurrentPassword}
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
              onChangeText={handleConfirmPassword}
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
            {/* <View style={styles.validationItem}>
              <Icon
                name={validation.noSpaces ? "check-circle" : "cancel"}
                size={20}
                color={validation.noSpaces ? "green" : "red"}
              />
              <Text style={validation.noSpaces ? styles.valid : styles.invalid}>
                There should be no spaces
              </Text>
            </View> */}
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    paddingTop: 20,
    // marginTop: 20,
    backgroundColor: "#fff",
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
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
    outlineStyle: "none",
    borderWidth: 0,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
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
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 30,
    marginBottom: 10,
    height: 50,
    width: 150,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    color: "#888",
    fontWeight: "bold",
  },
});

export default ChangePassword;
