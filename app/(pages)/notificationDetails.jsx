import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import ImageViewer from "react-native-image-zoom-viewer";
import { useNavigation } from "@react-navigation/native"; // Import navigation
import Ionicons from "react-native-vector-icons/Ionicons";
const Details = () => {
  const [isImageOpen, setImageOpen] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false); // State to control popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State to control the popup message
  const [popupColor, setPopupColor] = useState(""); // State to control popup color
  const navigation = useNavigation(); // Hook for navigation

  const images = [
    {
      url: "https://example.com/your-image.jpg",
    },
  ];

  // Function to handle approve/reject actions
  const handleAction = (action) => {
    if (action === "approve") {
      setPopupMessage("Request Approved");
      setPopupColor(colors.greenessColor); // Green color for approved
    } else if (action === "reject") {
      setPopupMessage("Request Rejected");
      setPopupColor(colors.radiusColor); // Red color for rejected
    }
    setPopupVisible(true); // Show the popup

    // After 2 seconds, hide the popup and navigate to home
    setTimeout(() => {
      setPopupVisible(false);
      navigation.navigate("(pages)/dashboard"); // Redirect to home screen
    }, 2000); // 2 seconds delay
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {/* Back Button with Icon */}
            <TouchableOpacity
              onPress={() => navigation.navigate("(pages)/notification")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />{" "}
              {/* Back Icon */}
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Profile Details</Text>
          </View>
          {/* Title */}

          {/* Profile Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>Jenifer K.</Text>

            <Text style={styles.label}>E-mail Address</Text>
            <Text style={styles.value}>jeniferk@gmail.com</Text>

            <Text style={styles.label}>Social Security Number</Text>
            <Text style={styles.value}>xxx-xx-xxxx</Text>

            <Text style={styles.label}>Project Selection</Text>
            <Text style={styles.value}>N/A</Text>
          </View>

          {/* Uploaded Proof Section */}
          <View style={styles.proofContainer}>
            <Text style={styles.label}>Uploaded Proof</Text>

            {/* Touchable Image to Open Modal */}
            <TouchableOpacity onPress={() => setImageOpen(true)}>
              <Image
                source={{
                  uri: "https://i.pinimg.com/564x/2c/8d/7e/2c8d7e491f74b3f7c3ad2037f262f72e.jpg",
                }}
                style={styles.image}
              />
            </TouchableOpacity>

            {/* Modal for Image Viewer */}
            <Modal visible={isImageOpen} transparent={true}>
              <ImageViewer
                imageUrls={images}
                enableSwipeDown={true}
                onCancel={() => setImageOpen(false)}
              />
            </Modal>
          </View>

          {/* Action Buttons Section */}
          <View style={styles.buttonContainer}>
            {/* Approve Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleAction("approve")} // Handle approve action
            >
              <Text style={styles.buttonText}>Approve Request</Text>
            </TouchableOpacity>

            {/* Reject Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleAction("reject")} // Handle reject action
            >
              <Text style={styles.rejectButtonText}>Reject Request</Text>
            </TouchableOpacity>
          </View>

          {/* Popup Message */}
          {isPopupVisible && (
            <View style={[styles.popup, { backgroundColor: popupColor }]}>
              <Text style={styles.popupText}>{popupMessage}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  scrollContainer: {},
  proofContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.grayColor,
    backgroundColor: colors.whiteColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    },
  ///
  headerContainer: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Space between back icon and title
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "100%",
  },
  backButtonContainer: {
    justifyContent: "flex-start", // Align back button to the left
    flex: 0, // Ensure it doesn't take up space
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.WorkSans700,
    color: colors.blackColor,
    textAlign: "center", // Center text
    flex: 1, // Title takes up remaining space to be centered
    },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: colors.grayLightColor,
    resizeMode: "cover",
  },
  container: {
    padding: 20,
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.1,
    },
  
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: fonts.WorkSans600,
    fontSize: 16,
    color: colors.blackColor,
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    fontFamily: fonts.WorkSans400,
    fontSize: 16,
    color: colors.grayColor,
    marginBottom: 15,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: colors.greenessColor,
  },
  rejectButton: {
    backgroundColor: colors.radiusColor,
  },
  buttonText: {
    color: colors.whiteColor,
    fontFamily: fonts.WorkSans600,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  rejectButtonText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.WorkSans600,
  },
  popup: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    color: colors.whiteColor,
    fontFamily: fonts.WorkSans600,
    fontSize: 16,
  },
});
