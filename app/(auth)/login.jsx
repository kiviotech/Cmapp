import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import CustomButton from "../../components/CustomButton";
import LoginField from "../../components/LoginField";
import { useRouter } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { login } from "../../src/utils/auth";
import { Modal } from "react-native";
import useAuthStore from "../../useAuthStore";
// import AsyncStorage from "@react-native-async-storage/async-storage";

NativeWindStyleSheet.setOutput({
  default: "native",
});

SplashScreen.preventAutoHideAsync();

const Login = () => {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  React.useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  if (!fontsLoaded) {
    return null;
  }

  const [usePassword, setUsePassword] = useState(true);
  const [form, setForm] = useState({
    mobile: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
    password: "",
    otp: "",
  });

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const navigation = useNavigation();

  const validateField = (name, value) => {
    let error = "";
    if (name === "mobile") {
      const mobileRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        error = "Email is required";
      } else if (!mobileRegex.test(value)) {
        error = "Invalid email";
      }
    }
    if (usePassword && name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }
    if (!usePassword && name === "otp") {
      if (!value) {
        error = "OTP is required";
      } else if (value.length !== 6) {
        error = "OTP must be 6 digits";
      }
    }
    return error;
  };

  const handleChangeText = (name, value) => {
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    try {
      // Validate form fields based on the login method (password or OTP)
      const mobileError = validateField("mobile", form.mobile);
      const passwordError = usePassword
        ? validateField("password", form.password)
        : "";
      const otpError = !usePassword ? validateField("otp", form.otp) : "";

      if (mobileError || passwordError || otpError) {
        // Set errors if any validation fails and return early
        setErrors({
          mobile: mobileError,
          password: passwordError,
          otp: otpError,
        });
        return;
      }

      // Attempt to log in using the appropriate credential (password or OTP)
      const response = await login(
        form.mobile,
        usePassword ? form.password : form.otp
      );

      // If login is successful and user data is returned
      // if (response && response.user && response.user.username) {
      //   // Store the username and user ID in AsyncStorage
      //   await AsyncStorage.setItem("username", response.user.username);
      //   await AsyncStorage.setItem("id", response.user.id.toString());

      //   console.log("Username stored in AsyncStorage:", response.user.username);
      //   console.log("User ID stored in AsyncStorage:", response.user.id);

      //   // Navigate to the dashboard using the router
      // }
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error during login:", error.message);
      // Handle the error, such as displaying an error message to the user
      setIsErrorModalVisible(true);
    }
  };

  const closeErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Login</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>E-mail</Text>
            <LoginField
              placeholder="Your email or phone"
              value={form.mobile}
              handleChangeText={(value) => handleChangeText("mobile", value)}
              keyboardType="email-address"
              style={styles.loginField}
            />
            {errors.mobile ? (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            ) : null}

            {usePassword ? (
              <View style={styles.passwordContainer}>
                <Text style={styles.labelText}>Password</Text>
                <LoginField
                  style={styles.loginField}
                  placeholder="Password"
                  value={form.password}
                  handleChangeText={(value) =>
                    handleChangeText("password", value)
                  }
                  secureTextEntry={true}
                />
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.otpContainer}>
                <Text style={styles.labelText}>OTP</Text>
                <LoginField
                  placeholder="OTP"
                  value={form.otp}
                  handleChangeText={(value) => handleChangeText("otp", value)}
                  keyboardType="number-pad"
                  style={styles.loginField}
                />
                {errors.otp ? (
                  <Text style={styles.errorText}>{errors.otp}</Text>
                ) : null}
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("(auth)/ForgotPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            buttonStyle={styles.loginButton}
            textStyle={styles.loginButtonText}
            text="LOGIN"
            handlePress={() => handleLogin("login")}
          />
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don’t have an account?
            <TouchableOpacity
              onPress={() => navigation.navigate("(auth)/SignUp")}
            >
              <Text style={styles.signUpLink}> Sign Up</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={isErrorModalVisible}
        animationType="fade"
        onRequestClose={closeErrorModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Invalid Credentials</Text>
            <Text style={styles.modalMessage}>
              Please check your email and password and try again.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeErrorModal}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 32,
  },
  headerText: {
    // fontFamily: fonts.WorkSans600,
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordContainer: {
    marginTop: 32,
  },
  otpContainer: {
    marginTop: 32,
  },
  labelText: {
    color: colors.loginSignUpLabelColor,
    fontSize: 13,
    paddingBottom: 2,
  },
  forgotPasswordText: {
    marginTop: 5,
    fontSize: 14,
    color: "#577CFF",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#577CFF",
    fontSize: 13,
    width: 140,
    letterSpacing: 1,
  },
  loginButtonText: {
    // fontFamily: fonts.WorkSans400,
    color: "#FFFFFF",
  },
  signUpContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  signUpText: {
    fontSize: 14,
    color: "#9C9C9C",
  },
  signUpLink: {
    color: "#577CFF",
  },
  loginField: {
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
  },
});