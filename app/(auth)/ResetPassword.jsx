import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { resetPassword } from "../../src/utils/auth";
import { BASE_URL } from "../../src/api/apiClient";
import axios from "axios";

const ResetPassword = () => {
  const { code } = useLocalSearchParams();
  const router = useRouter();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      valid = false;
    }

    if (!form.confirmPassword || form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChangeText = (field, value) => {
    setForm({ ...form, [field]: value });

    // Clear errors for the field being updated
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const submit = async () => {
    const isValid = validateForm();

    if (isValid) {
      try {
        const data = {
          password: form.password,
          passwordConfirm: form.confirmPassword,
          code: code,
        };
        // Simulate successful password reset
        const response = await axios.post(
          `${BASE_URL}/auth/reset-password`,
          data
        );
        Alert.alert("Success", "Password reset successfully!");
        // Navigate to the password changed notification screen
        // router.push("/auth/passwordChangedNotification");
      } catch (error) {
        console.error("Error:", error.message);
        Alert.alert("Error", "An error occurred. Please try again.");
      }
    } else {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>Enter your new password below.</Text>

        {/* New Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#B3B3B3"
            secureTextEntry
            value={form.password}
            onChangeText={(value) => handleChangeText("password", value)}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#B3B3B3"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(value) => handleChangeText("confirmPassword", value)}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    // marginTop: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResetPassword;
