import React from "react";
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

const UploadProof = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.border}>
            <TouchableOpacity
              onPress={() => navigation.navigate("(pages)/dashboard")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />{" "}
              {/* Back Icon */}
            </TouchableOpacity>
            <Text style={styles.instructions}>Notifications</Text>
          </View>

          {/* Notification Card */}
          <View style={styles.notificationContainer}>
            <Text style={styles.pagraph}>
              Contractor ABC has requested to verify the project details...
            </Text>

            {/* Touchable to navigate to detailed page */}
            <View style={{justifyContent:"flex-end",alignItems:"flex-end"}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("(pages)/notificationDetails")
                }
                style={styles.seeMoreButton}
              >
                <Text style={[styles.pagraph, styles.seeMore]}>See more</Text>
              </TouchableOpacity>
            </View>

            {/* Approve and Reject Buttons inside notification card */}
            <View style={styles.buttonContainer}>
              <CustomButton
                buttonStyle={styles.approveButton}
                textStyle={styles.buttonText}
                text="Approve Request"
              />
              <CustomButton
                buttonStyle={styles.rejectButton}
                textStyle={styles.buttonText}
                text="Reject Request"
              />
            </View>
          </View>
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
    elevation: 5, // Adds a subtle shadow effect
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
});
