import { View, Image, TextInput, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";
import colors from "../../constants/colors";

const LoginField = ({
  value = "",
  placeholder,
  handleChangeText,
  secureTextEntry = false,
  inputMode = "default",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityPassword, setShowSecurityPassword] = useState(false);
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#C4C4C4"
        value={value}
        onChangeText={handleChangeText}
        secureTextEntry={
          (placeholder === "Password" && !showPassword) ||
          (placeholder === "Social Security" && !showSecurityPassword)
        }
        inputMode={inputMode}
      />

      {(placeholder === "Password" ||
        placeholder === "Social Security" ||
        secureTextEntry) && (
        <Pressable
          activeOpacity={0.7}
          onPress={() => {
            if (placeholder === "Password") {
              setShowPassword(!showPassword);
            } else {
              setShowSecurityPassword(!showSecurityPassword);
            }
          }}
          style={styles.toggler}
        >
          <Image
            style={styles.togglerIcon}
            source={
              (
                placeholder === "Password"
                  ? !showPassword
                  : !showSecurityPassword
              )
                ? icons.eye
                : icons.eyeHide
            }
            resizeMode="contain"
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    backgroundColor: colors.whiteColor,
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 14,
    elevation: 5, // Adds shadow
    fontSize: 15,
  },
  toggler: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: [{ translateY: -21 }], // Adjusts the position to center vertically
    padding: 10,
  },
  togglerIcon: {
    width: 24,
    height: 24,
  },
});

export default LoginField;
