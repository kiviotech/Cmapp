import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getRegistrations, updateRegistration } from "../../src/api/repositories/registrationRepository";
import { getSubmissions, updateSubmission } from "../../src/api/repositories/submissionRepository";
import { createUser } from "../../src/api/repositories/userRepository";


const UploadProof = () => {
  const navigation = useNavigation();
  const [registrationDetail, setRegistrationsDetail] = useState([]);
  const [submissionDetail, setSubmissionDetail] = useState([]);
  const [selectedTab, setSelectedTab] = useState("joinRequests");

    useEffect(() => {
      if (selectedTab === "joinRequests") {
        const fetchRegistration = async () => {
          try {
            const registrationData = await getRegistrations();
            setRegistrationsDetail(registrationData?.data?.data);
          } catch (error) {
            console.error("Error fetching registrations:", error);
          }
        };
        fetchRegistration();
      } else if (selectedTab === "uploadedProofs") {
        const fetchSubmissions = async () => {
          try {
            const submissionData = await getSubmissions();
            setSubmissionDetail(submissionData?.data?.data);
          } catch (error) {
            console.error("Error fetching submissions:", error);
          }
        };
        fetchSubmissions();
      }
    }, [selectedTab]);
  const handleRejectSubmission = async (submissionId) => {
    try {
      const selectedSubmission = submissionDetail.find(
        (submission) => submission.id === submissionId
      );

      if (!selectedSubmission) {
        console.error("Submission not found!");
        return;
      }

      const payload = {
        data: {
          status: "rejected", // Update status to rejected
          taskName: selectedSubmission.attributes.task.data.attributes.name,
          userId: selectedSubmission.attributes.user.data.id,
        },
      };

      await updateSubmission(submissionId, payload); // Call your API

      // Remove the rejected submission from the state
      setSubmissionDetail((prevSubmissions) =>
        prevSubmissions.filter((submission) => submission.id !== submissionId)
      );
    } catch (error) {
      console.error("Error rejecting submission:", error);
    }
  };

  
  const handleApproveSubmission = async (submissionId) => {
    try {
      // Find the submission object that matches the selected submissionId
      const selectedSubmission = submissionDetail.find(
        (submission) => submission.id === submissionId
      );

      if (!selectedSubmission) {
        console.error("Submission not found!");
        return;
      }

      // Construct the payload using data from the selected submission
      const payload = {
        data: {
          status: "approved", // Update status to approved
          task: selectedSubmission.attributes.task.data.attributes.id,
          submissionDate: selectedSubmission.attributes.submissionDate,
          comment: selectedSubmission.attributes.comment,
          count: 0,
          proofOfWork : []
        },
      };

//       Example Value
// Schema
// {
//   "data": {
//     "comment": "string",
//     "proofOfWork": [
//       "string or id",
//       "string or id"
//     ],
//     "count": 0,
//     "status": "pending",
//     "task": "string or id"
//   }

      // Send the payload to update the submission
      const response = await updateSubmission(submissionId, payload); // Assuming updateSubmission is a function from your repository to update the submission

      // Update the state to remove the approved submission from the list
      setSubmissionDetail((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission.id === submissionId
            ? {
                ...submission,
                attributes: { ...submission.attributes, status: "approved" },
              }
            : submission
        )
      );

      if (response.status === 200) {
        console.log("Submission approved successfully!");
      }
    } catch (error) {
      console.error("Error approving submission:", error);
    }
  };


  // Existing handleApprove and handleReject functions for registrations
  const handleApprove = async (registrationId) => {
    try {
      // Find the registration object that matches the selected registrationId
      const selectedRegistration = registrationDetail.find(
        (registration) => registration.id === registrationId
      );

      if (!selectedRegistration) {
        console.error("Registration not found!");
        return;
      }

      // Construct the payload using data from the selected registration
      const payload = {
        data: {
          status: "approved", // Update status to approved
          socialSecurityNumber:
            selectedRegistration.attributes.socialSecurityNumber,
          fullName: selectedRegistration.attributes.fullName,
          email: selectedRegistration.attributes.email, // Assuming email is part of the registration data
        },
      };

      const response = await updateRegistration(registrationId, payload); // Send the correct payload

      // Update the state to remove the approved registration from the list
       setRegistrationsDetail((prevRegistrations) =>
         prevRegistrations.map((registration) =>
           registration.id === registrationId
             ? {
                 ...registration,
                 attributes: { ...registration.attributes, status: "approved" },
               }
             : registration
         )
       );

      // Construct user data from the registration data
      const userData = {
        username: selectedRegistration.attributes.fullName, // Full name as username
        email: selectedRegistration.attributes.email, // Email from registration
        password: selectedRegistration.attributes.password, // You can generate a strong default password here
      };

      if (response.status == 200) {
        await createUser(userData);
      }
    } catch (error) {
      console.error("Error approving registration:", error);
    }
  };

  const handleReject = async (registrationId) => {
    try {
      // Find the registration object that matches the selected registrationId
      const selectedRegistration = registrationDetail.find(
        (registration) => registration.id === registrationId
      );

      if (!selectedRegistration) {
        console.error("Registration not found!");
        return;
      }

      // Construct the payload using data from the selected registration
      const payload = {
        data: {
          status: "rejected", // Update status to approved
          socialSecurityNumber:
            selectedRegistration.attributes.socialSecurityNumber,
          fullName: selectedRegistration.attributes.fullName,
          email: selectedRegistration.attributes.email,
        },
      };

      await updateRegistration(registrationId, payload); // Send the correct payload

      // Update the state to remove the rejected registration from the list
      setRegistrationsDetail((prevRegistrations) =>
        prevRegistrations.filter(
          (registration) => registration.id !== registrationId
        )
      );
    } catch (error) {
      console.error("Error rejecting registration:", error);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.border}>
        <TouchableOpacity
          onPress={() => navigation.navigate("(pages)/dashboard")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          {/* Back Icon */}
        </TouchableOpacity>
        <Text style={styles.instructions}>Notifications</Text>
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedTab === "joinRequests" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("joinRequests")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "joinRequests" && styles.activeTabText,
            ]}
          >
            Registrant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedTab === "uploadedProofs" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("uploadedProofs")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "uploadedProofs" && styles.activeTabText,
            ]}
          >
            Submissions
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.mainContainer}>
          {/* Registration Notifications */}
          {selectedTab === "joinRequests" &&
            registrationDetail
              .filter(
                (registration) => registration.attributes.status === "pending"
              )
              .map((registration) => (
                <View
                  key={registration.id}
                  style={styles.notificationContainer}
                >
                  <Text style={styles.paragraph}>
                    {registration.attributes?.fullName} has requested to verify
                    the project details...
                  </Text>

                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("(pages)/notificationDetails", {
                          registrationId: registration.id,
                        })
                      }
                      style={styles.seeMoreButton}
                    >
                      <Text style={[styles.paragraph, styles.seeMore]}>
                        See more
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.buttonContainer}>
                    <CustomButton
                      buttonStyle={styles.approveButton}
                      textStyle={styles.buttonText}
                      text="Approve Request"
                      handlePress={() => handleApprove(registration.id)}
                    />
                    <CustomButton
                      buttonStyle={styles.rejectButton}
                      textStyle={styles.buttonText}
                      text="Reject Request"
                      handlePress={() => handleReject(registration.id)}
                    />
                  </View>
                </View>
              ))}

          {/* Submission Notifications */}
          {selectedTab === "uploadedProofs" &&
            submissionDetail.map((submission) => (
              <View key={submission.id} style={styles.notificationContainer}>
                <Text style={styles.paragraph}>
                  {submission?.id} has submitted proof of{" "}
                  {submission?.attributes.task.data.attributes.name}
                </Text>

                <View
                  style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("(pages)/submissionDetails", {
                        submissionId: submission.id,
                      })
                    }
                    style={styles.seeMoreButton}
                  >
                    <Text style={[styles.paragraph, styles.seeMore]}>
                      See more
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                  <CustomButton
                    buttonStyle={styles.approveSubmission}
                    textStyle={styles.buttonText}
                    text="Approve Submission"
                    handlePress={() => handleApproveSubmission(submission.id)}
                  />
                  <CustomButton
                    buttonStyle={styles.rejectSubmission}
                    textStyle={styles.buttonText}
                    text="Reject Submission"
                    handlePress={() => handleRejectSubmission(submission.id)}
                  />
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadProof;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  instructions: {
    fontSize: 24,
    fontFamily: fonts.WorkSans600,
    paddingLeft: 100,
  },
  pagraph: {
    color: colors.blackColor,
    fontSize: 16,
    padding: 5,
    fontFamily: fonts.WorkSans400,
  },
  seeMore: {
    textAlign: "center",
    color: colors.primary,
  },
  border: {
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    margin: 10
  },
  notificationContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    gap: 10// Adds a subtle shadow effect
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#DFDFDF", // Border line between content and buttons
  },
  approveButton: {
    backgroundColor: colors.greenessColor,
    fontSize: 10,
    width: 150,
    letterSpacing: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  approveSubmission: {
    backgroundColor: colors.greenessColor,
    fontSize: 10,
    width: 160,
    letterSpacing: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: colors.radiusColor,
    fontSize: 10,
    width: 150,
    letterSpacing: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectSubmission: {
    backgroundColor: colors.radiusColor,
    fontSize: 10,
    width: 160,
    letterSpacing: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: fonts.WorkSans600,
    color: colors.whiteColor,
  },
  seeMoreButton: {
    // backgroundColor: "#000",
    backgroundColor: "#ffffff",
    padding: 3,
    borderRadius: 100,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (x and y)
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow blur radius
    elevation: 5, // Shadow for Android
    justifyContent: "flex-end",
    width: 120,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  tabItem: {
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: colors.blackColor,
    fontFamily: fonts.WorkSans400,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  activeTabText: {
    color: colors.primary,
    fontFamily: fonts.WorkSans600,
  },
});
