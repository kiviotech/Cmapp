import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import useAuthStore from "../../useAuthStore";
import { updateExistingRegistration } from "../../src/services/registrationService";

const RequestDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { requestData } = route.params || {};
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    console.log("Request Details:", requestData);
  }, [requestData]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedData = {
        data: {
          status: newStatus,
          approver: userId,
        },
      };
      const response = await updateExistingRegistration(
        requestData?.id,
        updatedData
      );
      if (response.data) {
        Alert.alert("Success", `Request ${newStatus} successfully!`);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating request:", error);
      Alert.alert(
        "Error",
        "An error occurred while updating the request status."
      );
    }
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Request Details</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>
            Requester Name:{" "}
            <Text style={styles.textBold}>
              {requestData?.attributes?.username}
            </Text>
          </Text>
          <Text style={styles.label}>
            Social Security Number:{" "}
            <Text style={styles.textBold}>
              {requestData?.attributes?.socialSecurityNumber}
            </Text>
          </Text>
          <Text style={styles.label}>
            Status:{" "}
            <Text style={styles.textBold}>
              {requestData?.attributes?.status}
            </Text>
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleStatusChange("rejected")}
          >
            <Text style={styles.buttonText}>Reject Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleStatusChange("approved")}
          >
            <Text style={styles.buttonText}>Approve Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 5,
    marginTop: 20,
    width: "100%",
  },
  container: {
    padding: 16,
    backgroundColor: "#FFF",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 19,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  textBold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  rejectButton: {
    backgroundColor: "#FC5275",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#A3D65C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default RequestDetails;
