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
import { useNavigation } from "@react-navigation/native"; // Added for navigation
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";

const UploadProof = () => {
  const navigation = useNavigation(); // Using navigation

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

          <Text style={styles.pagraph}>
            Contractor ABC has requested to verify the project details...
          </Text>

          {/* Touchable to navigate to detailed page */}
          <TouchableOpacity
            onPress={() => navigation.navigate("(pages)/notificationDetails")}
          >
            <Text style={[styles.pagraph, styles.seeMore]}>See more</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <FontAwesome
            style={styles.iconLeft}
            name="check-circle"
            size={15}
            color="#FFFFFF"
          />
          <CustomButton
            buttonStyle={styles.approveButton}
            textStyle={styles.buttonText}
            text="Approve Request"
          />
          <FontAwesome
            style={styles.iconRight}
            name="times-circle"
            size={15}
            color="#FFFFFF"
          />
          <CustomButton
            buttonStyle={styles.rejectButton}
            textStyle={styles.buttonText}
            text="Reject Request"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadProof;

const styles = StyleSheet.create({
  mainContainer: {
        flex: 1,
        padding: 10
  },
  instructions: {
    fontSize: 24,
    fontFamily: fonts.WorkSans600,
    paddingLeft: 100,
  },
  pagraph: {
    color: colors.blackColor,
    fontSize: 14,
    paddingTop: 20,
    padding: 15,
    fontFamily: fonts.WorkSans400,
  },
  seeMore: {
    textAlign: "right",
    paddingRight: 20,
    color: colors.linkColor, // Add custom color for "see more"
  },
  border: {
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    paddingBottom: 30,
    paddingTop: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    borderColor: "#DFDFDF",
    paddingRight: 20,
    borderBottomWidth: 1,
    paddingBottom: 30,
  },
  iconLeft: {
    position: "absolute",
    left: 35,
    zIndex: 1000,
    top: 12,
  },
  iconRight: {
    position: "absolute",
    right: 155,
    zIndex: 1000,
    top: 12,
  },
  approveButton: {
    backgroundColor: colors.greenessColor,
    fontSize: 10,
    width: 170,
    letterSpacing: 1,
  },
  rejectButton: {
    backgroundColor: colors.radiusColor,
    fontSize: 10,
    width: 160,
    letterSpacing: 1,
  },
  buttonText: {
    fontFamily: fonts.WorkSans600,
    color: colors.whiteColor,
    marginLeft: 20,
  },
});
