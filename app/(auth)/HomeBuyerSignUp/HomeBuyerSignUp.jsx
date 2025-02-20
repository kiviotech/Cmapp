import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { fetchProjects } from "../../../src/services/projectService";
import { createNewUser } from "../../../src/services/userService";

const HomeBuyerSignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    project: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSSN, setShowSSN] = useState(false);
  const [projectOptions, setProjectOptions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await fetchProjects();
        const formattedProjects = projects.data.map((project) => ({
          label: project.attributes.name, 
          value: project.id, 
        })); 
        setProjectOptions(formattedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        Alert.alert("Error", "Failed to load projects.");
      }
    };

    loadProjects();
  }, []);


  const handleSignUp = async () => {
    try {
      // Prepare the user data
      const userData = {
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
        project: formData.project, // Send project ID as part of the request
      };
  
      // Call the createNewUser function to send the request
      const response = await createNewUser(userData);
  
      // Check if the response is successful and show an alert or navigate accordingly
      if (response) {
        Alert.alert("Success", "Sign-up successful!");
        // Optionally, navigate to the login page after successful sign-up
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      Alert.alert("Error", "Failed to sign up. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#aaa"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />

      {/* Email */}
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Your email or phone"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={18} color="#777" />
        </TouchableOpacity>
      </View>

     
      {/* Project Selection Dropdown */}
      <Text style={styles.label}>Project Selection</Text>
      <Dropdown
        data={projectOptions}
        value={formData.project}
        onChange={(item) => setFormData({ ...formData, project: item.value })}
        style={styles.dropdown}
        labelField="label"
        valueField="value"
        placeholder="Select a project"
      />

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>SIGNUP</Text>
      </TouchableOpacity>

      {/* Already have an account? Login */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.loginLink} onPress={() => router.push("/login")}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 35,
    paddingTop: 60
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 25,
  },
  passwordContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  dropdown: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 25,
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4F75FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  signupButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
  loginLink: {
    color: "#4F75FF",
    fontWeight: "bold",
  },
});

export default HomeBuyerSignUp;
