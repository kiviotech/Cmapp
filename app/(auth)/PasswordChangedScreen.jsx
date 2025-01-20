import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
// import Successmark from "../../assets/Successmark.jpg"
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const PasswordChangedNotification = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push("./Login");
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        {/* <Image source={Successmark} style={styles.imageStyle} /> */}
      </View>

      <Text style={styles.textStyle}>Password Changed!</Text>
      <Text
        style={[
          styles.textStyle,
          { color: "#666", fontSize: 16, fontWeight: "500", marginBottom: 30 },
        ]}
      >
        Your password has been changed{" "}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.redirectButton} onPress={goToLogin}>
          <Text style={styles.redirectButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PasswordChangedNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  textStyle: {
    color: "#333",
    textAlign: "center",
    fontSize: 24,
    marginVertical: 5,
  },
  imageStyle: {
    marginBottom: 20,
    resizeMode: "contain",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  redirectButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  redirectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
