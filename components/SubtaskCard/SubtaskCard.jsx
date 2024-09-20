import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";
const MyProjectCard = ({ cardValue, cardColor}) => {
  const navigation = useNavigation();
  const wrapTextAfterWords = (text, wordsPerLine) => {
    const words = text.split(" ");
    let wrappedText = "";
    for (let i = 0; i < words.length; i += wordsPerLine) {
      wrappedText += words.slice(i, i + wordsPerLine).join(" ") + "\n";
    }
    return wrappedText.trim();
  };
  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("(pages)/taskDetails", { id: cardValue.id })
        }
      >
        <View style={[styles.cardContainer, { backgroundColor: "#EEF7E0" }]}>
          <Text style={styles.projectName}>{cardValue.attributes.name}</Text>
          <Text style={styles.projectDescription}>
            {wrapTextAfterWords(cardValue.attributes.description, 5)}
          </Text>
          <View
            style={[
              styles.deadlineContainer,
              { borderTopColor: "#DFDFDF", borderTopWidth: 1 },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Image source={icons.clockFilled}></Image>
              <Text style={styles.deadlineText}>
                {cardValue.attributes.deadline}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 20,
    height: "auto",
    marginVertical: 10,
    marginRight: 10,
  },
  projectName: {
    color: "#577CFF",
    fontFamily: "WorkSans_500Medium",
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 40,
    letterSpacing: 0.09,
  },
  projectDescription: {
    color: "#577CFF",
    fontFamily: "WorkSans_500Medium",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "300",
    lineHeight: 15, // Adjust as needed
    letterSpacing: -0.06,
    whiteSpace: "pre-wrap", // Ensure newlines are respected
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

export default MyProjectCard;
