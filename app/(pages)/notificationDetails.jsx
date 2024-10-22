import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import Swiper from "react-native-swiper";
import { WebView } from "react-native-webview";
import { getRegistrationById } from "../../src/api/repositories/registrationRepository";
import { useRoute } from "@react-navigation/native";

const Details = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [registrationDetail, setRegistrationDetail] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); // Handle both image and pdf
  const [popupAnimation] = useState(new Animated.Value(-100)); // Animation for toaster
  const route = useRoute();
  const id = route.params.registrationId || 0;
  const navigation = useNavigation();
  const baseURL = "http://localhost:1337"; // Base URL for localhost

  const proofs = [
    {
      url: "https://i.pinimg.com/564x/2c/8d/7e/2c8d7e491f74b3f7c3ad2037f262f72e.jpg",
      type: "image",
    },
    {
      url: "https://publuu.com/flip-book/654309/1458936", // Sample PDF URL
      type: "pdf", // Mark this as a PDF
    },
    {
      url: "https://i.pinimg.com/564x/2c/8d/7e/2c8d7e491f74b3f7c3ad2037f262f72e.jpg",
      type: "image",
    },
  ];

  useEffect(() => {
    const fetchRegistrationByID = async () => {
      try {
        const registrationData = await getRegistrationById(Number(id));
        setRegistrationDetail(registrationData.data.data);

        if (registrationData.data.data.attributes.docs) {
          const docs = registrationData.data.data.attributes.docs.data.map(
            (doc) => ({
              id: doc.id,
              fileName: doc.attributes.name,
              url: `${baseURL}${doc.attributes.url}`,
              mimeType: doc.attributes.mime,
            })
          );
          setDocuments(docs);
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    fetchRegistrationByID();
  }, [id]);

  // Function to render each proof item in the carousel
  const renderProofItem = (proof, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.slide}
        onPress={() => {
          setSelectedDocument(proof); // Save selected image or pdf
          setModalVisible(true); // Open modal
        }}
      >
        {/* Render either image or a placeholder for PDF */}
        {proof.type === "image" ? (
          <Image source={{ uri: proof.url }} style={styles.image} />
        ) : (
          <View style={styles.pdfPlaceholder}>
            <Ionicons name="document" size={50} color={colors.blackColor} />
            <Text style={styles.pdfText}>View PDF</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const showToast = (message, color) => {
    setPopupMessage(message);
    setPopupColor(color);
    setPopupVisible(true);

    // Slide in animation for the toaster
    Animated.timing(popupAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Hide the popup after 1 second
    setTimeout(() => {
      Animated.timing(popupAnimation, {
        toValue: -100, // Move back to the top
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setPopupVisible(false);
      });
    }, 500);
  };

  const handleAction = (action) => {
    if (action === "approve") {
      showToast("Request Approved", colors.greenessColor);
    } else {
      showToast("Request Rejected", colors.radiusColor);
    }

    // Redirect to dashboard after the popup disappears
    setTimeout(() => {
      navigation.navigate("(pages)/notification");
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("(pages)/notification")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Profile Details</Text>
          </View>

          {/* Profile Information Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>
              {registrationDetail?.attributes?.fullName}
            </Text>
            <Text style={styles.label}>E-mail Address</Text>
            <Text style={styles.value}>
              {registrationDetail?.attributes?.email}
            </Text>
            <Text style={styles.label}>Social Security Number</Text>
            <Text style={styles.value}>xxx-xx-xxxx</Text>
            <Text style={styles.label}>Project Selection</Text>
            <Text style={styles.value}>
              {registrationDetail?.attributes?.project?.data?.attributes?.name}
            </Text>
          </View>

          {/* Uploaded Proof Section */}
          <View style={styles.proofContainer}>
            <Text style={styles.label}>Uploaded Proofs</Text>
            <Swiper showsButtons loop>
              {proofs.map(renderProofItem)}
            </Swiper>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleAction("approve")}
            >
              <Text style={styles.buttonText}>Approve Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleAction("reject")}
            >
              <Text style={styles.rejectButtonText}>Reject Request</Text>
            </TouchableOpacity>
          </View>

          {/* Toast Notification */}
          {isPopupVisible && (
            <Animated.View
              style={[
                styles.popup,
                {
                  backgroundColor: popupColor,
                  transform: [{ translateY: popupAnimation }],
                },
              ]}
            >
              <Text style={styles.popupText}>{popupMessage}</Text>
            </Animated.View>
          )}

          {/* Modal for Full-Screen Document View */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            {selectedDocument ? (
              selectedDocument.type === "image" ? (
                <TouchableOpacity
                  style={styles.fullScreenModal}
                  onPress={() => setModalVisible(false)}
                >
                  <Image
                    source={{ uri: selectedDocument.url }}
                    style={styles.fullSizeImage}
                  />
                </TouchableOpacity>
              ) : selectedDocument.type === "pdf" && Platform.OS === "web" ? (
                <TouchableOpacity
                  style={styles.fullScreenModal}
                  onPress={() => setModalVisible(false)}
                >
                  {/* Render PDF with iframe for web */}
                  <iframe
                    src={selectedDocument.url}
                    style={styles.fullSizeIframe}
                    title="PDF Viewer"
                  />
                </TouchableOpacity>
              ) : (
                selectedDocument.url && (
                  <TouchableOpacity
                    style={styles.fullScreenModal}
                    onPress={() => setModalVisible(false)}
                  >
                    {/* Render PDF with WebView for mobile */}
                    <WebView
                      source={{ uri: selectedDocument.url }}
                      style={styles.fullSizeImage}
                    />
                  </TouchableOpacity>
                )
              )
            ) : null}
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  container: {
    padding: 20,
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.WorkSans700,
    color: colors.blackColor,
    textAlign: "center",
    flex: 1,
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
  proofContainer: {
    height: 300, // Adjust height for carousel
    marginBottom: 20,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  pdfPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayColor,
  },
  pdfText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.WorkSans600,
    color: colors.blackColor,
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
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    zIndex: 1000,
  },
  popupText: {
    color: colors.whiteColor,
    fontFamily: fonts.WorkSans600,
    fontSize: 16,
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Dark background for better focus on image or PDF
  },
  fullSizeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // Maintain aspect ratio without cropping
  },
  fullSizeIframe: {
    width: "100%",
    height: "100%",
    border: "none", // Remove iframe border
  },
});
