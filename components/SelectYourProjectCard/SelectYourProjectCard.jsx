import React from "react";
import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { icons } from "../../constants";

const SelectYourProjectCard = ({ cardValue, cardColor }) => {
  return (
    <ScrollView>
      <View style={[styles.cardContainer, { backgroundColor: "#EEF7E0" }]}>
        <Text style={styles.projectName}>{cardValue.name}</Text>
        <Text style={styles.projectDescription}>{cardValue.desc}</Text>
        <View>
          <Text style={styles.dot}></Text>
          <Text style={styles.ongoing}>{cardValue.update}</Text>
        </View>

        <View
          style={[
            styles.deadlineContainer,
            { borderTopColor: "#DFDFDF", borderTopWidth: 1 },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Image source={icons.clockFilled}></Image>
            <Text style={styles.deadlineText}>{cardValue.deadline}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 20,
    height: "auto",
    marginVertical: 10,
    width: 200,
  },
  ongoing: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 15,
    paddingTop: 15,
    color: "#FC5275",
  },
  projectName: {
    color: "#000B23",
    fontFamily: "WorkSans_500Medium",
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 40,
    letterSpacing: 0.09,
  },
  projectDescription: {
    color: "#7B7B7B",
    fontFamily: "WorkSans_500Medium",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "300",
    lineHeight: 15, // Adjust as needed
    letterSpacing: -0.06,
  },
  deadlineContainer: {
    marginTop: 30,
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dateICon: {
    width: 28,
    height: 28,
    position: "relative",
    top: 9,
    marginRight: 10,
  },
  deadlineText: {
    color: "#A3D65C",
    fontFamily: "WorkSans_400Regular",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 12, // Adjust as needed
    letterSpacing: 0.06,
  },
});

export default SelectYourProjectCard;
