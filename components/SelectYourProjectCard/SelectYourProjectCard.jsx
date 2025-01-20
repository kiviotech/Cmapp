import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { icons } from "../../constants";

const SelectYourProjectCard = ({ cardValue }) => {
  // Add safety checks for cardValue
  if (!cardValue) {
    return (
      <View style={[styles.cardContainer, { backgroundColor: "#EEF7E0" }]}>
        <Text style={styles.projectName}>Loading...</Text>
      </View>
    );
  }

  const {
    name = "Untitled Project",
    desc = "No description available",
    update = "Status unavailable",
    deadline = "No deadline set",
    id = "1",
  } = cardValue;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { backgroundColor: "#EEF7E0" }]}
      // onPress={() => navigation.navigate("(pages)/contractor/ProjectDetails", {
      //   projectId: cardValue.id,
      // })}
    >
      <Text style={styles.projectName}>{name}</Text>
      <Text style={styles.projectDescription}>{desc}</Text>
      <View>
        <Text style={styles.ongoing}>{update}</Text>
      </View>

      <View style={[styles.deadlineContainer]}>
        <View style={styles.deadlineWrapper}>
          {icons?.clockFilled && (
            <Image source={icons.clockFilled} style={styles.clockIcon} />
          )}
          <Text style={styles.deadlineText}>{deadline}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    height: 200,
    margin: 10,
    width: 200,
  },
  ongoing: {
    fontSize: 15,
    paddingTop: 15,
    color: "#FC5275",
  },
  projectName: {
    color: "#000B23",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 40,
    letterSpacing: 0.09,
  },
  projectDescription: {
    color: "#7B7B7B",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 15,
    letterSpacing: -0.06,
  },
  deadlineContainer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopColor: "#DFDFDF",
    borderTopWidth: 1,
  },
  deadlineWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  clockIcon: {
    width: 20,
    height: 20,
  },
  deadlineText: {
    color: "#A3D65C",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: 0.06,
  },
});

export default SelectYourProjectCard;
