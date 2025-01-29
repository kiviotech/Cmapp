import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import useAuthStore from "../../../useAuthStore";
import { useNavigation } from "expo-router";
import { fetchProjectsByContractorEmail } from "../../../src/services/projectService";
import { URL } from "../../../src/api/apiClient";
import BottomNavigation from "./BottomNavigation ";
import { fetchRegistrationByEmail } from "../../../src/services/userService";

const PersonalDetailsScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [registrationDocs, setRegistrationDocs] = useState([]);

  const navigation = useNavigation();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const registrationData = await fetchRegistrationByEmail(user.email);
        if (registrationData.data[0]?.attributes?.documents?.data) {
          const docs = registrationData.data[0].attributes.documents.data.map(
            (doc) => ({
              url: `${URL}${doc.attributes.url}`,
              name: doc.attributes.name,
            })
          );
          setRegistrationDocs(docs);
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    if (user?.email) {
      fetchRegistrationData();
    }
  }, [user.email]);

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

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate("(pages)/contractor/settings")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Personal Details</Text>
          </View>

          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://avatars.githubusercontent.com/u/165383754?v=4",
              }}
              style={styles.profileImage}
            />
            {/* <TouchableOpacity style={styles.editIconContainer}>
              <Ionicons name="pencil" size={14} color="white" />
            </TouchableOpacity> */}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={user.username}
              onChangeText={setName}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={validateEmail}
              editable={false}
              inputMode="email-address"
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
                            keyboardType='phone-pad'
                            maxLength={10}
                        />
                        <TouchableOpacity style={styles.buttonContainer}>
                            <Text style={styles.actionText}>update</Text>
                        </TouchableOpacity>
                    </View> */}

          <Text style={styles.sectionTitle}>Registration Documents</Text>
          <View style={styles.documentsGrid}>
            {registrationDocs.map((doc, index) => (
              <TouchableOpacity
                key={index}
                style={styles.documentItem}
                onPress={() => handleImagePress(doc.url)}
              >
                <Image
                  source={{ uri: doc.url }}
                  style={styles.documentPreview}
                  defaultSource={{
                    uri: "https://placehold.co/200x200/png?text=Preview",
                  }}
                />
                <Text style={styles.documentName} numberOfLines={1}>
                  {doc.name || `Document ${index + 1}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Modal
            visible={imageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setImageModalVisible(false)}
          >
            <View style={styles.imageModalContainer}>
              <TouchableOpacity
                style={styles.closeImageButton}
                onPress={() => setImageModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </Modal>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const additionalStyles = {
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  closeImageButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 60,
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
  profileImageContainer: {
    alignSelf: "center",
    // position: "relative",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  documentsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  documentItem: {
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
  },
  documentPreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  documentName: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  ...additionalStyles,
});

export default PersonalDetailsScreen;
