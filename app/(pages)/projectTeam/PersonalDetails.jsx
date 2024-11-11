import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation";
import { icons } from "../../../constants";
import useAuthStore from "../../../useAuthStore";
import { useNavigation } from "@react-navigation/native";

const PersonalDetails = () => {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();

  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (text) => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(text)) {
      setError("");
    } else {
      setError("Please enter a valid email address");
    }
    setEmail(text);
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
            <Text style={styles.headerText}>Personal Details</Text>
          </View>

          <View style={styles.profileImageContainer}>
            <Image style={styles.profileImage} source={icons.userProfile} />
            <TouchableOpacity style={styles.editIconContainer}>
              <Ionicons name="pencil" size={14} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} editable={false} />
            {/* {console.log(user.user)} */}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
              keyboardType="email-address"
            />
            {/* <TouchableOpacity style={styles.buttonContainer}>
              <Text style={styles.actionText}>verify</Text>
            </TouchableOpacity> */}
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={true}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <TouchableOpacity style={styles.buttonContainer}>
              <Text style={styles.actionText}>update</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    //  backgroundColor: '#fff',
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    // marginTop: 20,
    borderBlockColor: "#000",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginLeft: 80,
  },
  profileImageContainer: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#1C1C1E",
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#E8E8E8",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#1C1C1E",
  },
  buttonContainer: {
    position: "absolute",
    right: 20,
    top: "65%",
    transform: [{ translateY: -10 }],
  },
  actionText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default PersonalDetails;
