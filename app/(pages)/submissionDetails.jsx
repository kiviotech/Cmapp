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
import { getSubmissionById } from "../../src/api/repositories/submissionRepository";
import { useRoute } from "@react-navigation/native";
import submissionEndpoints from "../../src/api/endpoints/submissionEndpoints";

const SubmissionDetails = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [submissionDetail, setSubmissionDetail] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); // Handle both image and pdf
  const [popupAnimation] = useState(new Animated.Value(-100)); // Animation for toaster
  const route = useRoute();
  const id = route.params.submissionId || 0;
  const navigation = useNavigation();
  const baseURL = "http://localhost:1338"; // Base URL for localhost

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
    const fetchSubmissionByID = async () => {
      try {
        const submissionData = await getSubmissionById(Number(id));
        setSubmissionDetail(submissionData.data.data);

        if (submissionData.data.data.attributes.docs) {
          const docs = submissionData.data.data.attributes.docs.data.map(
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
        console.error("Error fetching submission data:", error);
      }
    };

    fetchSubmissionByID();
  }, [id]);

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

    Animated.timing(popupAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(popupAnimation, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setPopupVisible(false);
      });
    }, 500);
  };

  const handleAction = (action) => {
    if (action === "approve") {
      showToast("Submission Approved", colors.greenessColor);
    } else {
      showToast("Submission Rejected", colors.radiusColor);
    }

    setTimeout(() => {
      navigation.navigate("(pages)/submission");
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
            <Text style={styles.title}>Submission Details</Text>
          </View>

          {/* Submission Information Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{submissionDetail?.id}</Text>
            <Text style={styles.label}>Comment</Text>
            <Text style={styles.value}>
              {submissionDetail?.attributes?.comment}
            </Text>
            <Text style={styles.label}>Project</Text>
            <Text style={styles.value}>
              {submissionDetail?.attributes?.task?.data?.attributes?.name}
            </Text>
            <Text style={styles.label}>Task</Text>
            <Text style={styles.value}>
              {submissionDetail?.attributes?.task?.data?.attributes?.name}
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
              <Text style={styles.buttonText}>Approve Submission</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleAction("reject")}
            >
              <Text style={styles.rejectButtonText}>Reject Submission</Text>
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

export default SubmissionDetails;

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
    // fontFamily: fonts.WorkSans700,
    color: colors.blackColor,
    textAlign: "center",
    flex: 1,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    // fontFamily: fonts.WorkSans600,
    fontSize: 16,
    color: colors.blackColor,
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    // fontFamily: fonts.WorkSans400,
    fontSize: 16,
    color: colors.grayColor,
    marginBottom: 15,
    paddingLeft: 10,
  },
  proofContainer: {
    height: 300,
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
    // fontFamily: fonts.WorkSans600,
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
    // fontFamily: fonts.WorkSans600,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  rejectButtonText: {
    color: colors.whiteColor,
    fontSize: 14,
    // fontFamily: fonts.WorkSans600,
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
    // fontFamily: fonts.WorkSans600,
    fontSize: 16,
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  fullSizeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  fullSizeIframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
});
