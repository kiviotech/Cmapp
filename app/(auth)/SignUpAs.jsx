import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SignUpAs = () => {
  const [selected, setSelected] = useState("Contractor");
  const router = useRouter();

  const handleNext = () => {
    if (selected === "Contractor") {
      router.push("(auth)/SignUp"); // Navigate to SignUp page
    } else {
      router.push("(auth)/HomeBuyerSignUp/HomeBuyerSignUp"); // Navigate to HomeBuyerSignUp page
    }
  };

  return (
    <View style={styles.container}>
      {/* Section moved to top */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Sign Up As</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, selected === "Contractor" && styles.selected]}
            onPress={() => setSelected("Contractor")}
          >
            <FontAwesome5 name="user-plus" size={20} color={selected === "Contractor" ? "#4F75FF" : "#6c757d"} />
            <Text style={[styles.optionText, selected === "Contractor" && styles.selectedText]}>Contractor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selected === "Home Buyer" && styles.selected]}
            onPress={() => setSelected("Home Buyer")}
          >
            <FontAwesome5 name="user-plus" size={20} color={selected === "Home Buyer" ? "#4F75FF" : "#6c757d"} />
            <Text style={[styles.optionText, selected === "Home Buyer" && styles.selectedText]}>Home Buyer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Section remains at bottom */}
      <View style={styles.bottomContainer}>
        <Text style={styles.signInText}>
          Already have an account? <Text style={styles.signInLink} onPress={() => router.push("/login")}>Sign-in</Text>
        </Text>

        <Text style={styles.termsText}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    justifyContent: "space-between", // Pushes content to top and bottom
  },
  topSection: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  option: {
    width: "48%", // Set width as percentage for responsiveness
    height: 90,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selected: {
    borderColor: "#4F75FF",
    backgroundColor: "#E8EDFF",
  },
  optionText: {
    fontSize: 14,
    marginTop: 5,
    color: "#6c757d",
  },
  selectedText: {
    color: "#577CFF",
    fontWeight: "bold",
  },
  nextButton: {
    width: "96%", // Adjusted to be a percentage for responsiveness
    backgroundColor: "#577CFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  signInText: {
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "bold",
    marginBottom: 20,
  },
  signInLink: {
    color: "#577CFF",
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    color: "#6c757d",
    marginTop: 10,
    paddingHorizontal: 30,
  },
});

export default SignUpAs;