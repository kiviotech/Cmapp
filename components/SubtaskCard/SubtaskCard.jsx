import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";

const SubtaskCard = ({ cardValue, cardColor = "#EEF7E0" }) => {
  const navigation = useNavigation();

  // Add safety check for cardValue
  if (!cardValue || !cardValue.attributes) {
    return (
      <View style={[styles.cardContainer, { backgroundColor: cardColor }]}>
        <Text style={styles.projectName}>Loading...</Text>
      </View>
    );
  }

  const wrapTextAfterWords = (text = "", wordsPerLine = 5) => {
    if (!text) return "";
    const words = text.split(" ");
    const lines = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(" "));
    }
    return lines.join("\n");
  };

  const {
    id,
    attributes: {
      name = "Untitled Task",
      description = "No description available",
      deadline = "No deadline set",
    } = {},
  } = cardValue;

  const handlePress = () => {
    if (id) {
      navigation.navigate("(pages)/taskDetails", { id });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.cardContainer, { backgroundColor: cardColor }]}>
        <Text style={styles.projectName} numberOfLines={2}>
          {name}
        </Text>

        <Text style={styles.projectDescription}>
          {wrapTextAfterWords(description)}
        </Text>

        <View style={styles.deadlineContainer}>
          <View style={styles.deadlineWrapper}>
            {icons?.clockFilled && (
              <Image
                source={icons.clockFilled}
                style={styles.clockIcon}
              />
            )}
            <Text style={styles.deadlineText}>{deadline}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 20,
    height: "auto",
    marginVertical: 10,
    marginRight: 10,
    minWidth: 200, // Add minimum width
    maxWidth: 300, // Add maximum width
  },
  projectName: {
    color: "#577CFF",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 40,
    letterSpacing: 0.09,
  },
  projectDescription: {
    color: "#577CFF",
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

export default SubtaskCard;