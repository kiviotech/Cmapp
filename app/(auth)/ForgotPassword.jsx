// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
//   Modal,
// } from "react-native";
// import axios from "axios";

// const ForgotPasswordScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

//   const validateEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleResetPassword = async () => {
//     if (!email) {
//       Alert.alert("Error", "Email is required");
//       return;
//     }

//     if (!validateEmail(email)) {
//       Alert.alert("Error", "Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await axios.post(
//         `http://localhost:1337/api/auth/forgot-password`,
//         { email }, // Only send the `email` key
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setIsSuccessModalVisible(true); // Show success modal if email was sent successfully
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.error?.message ||
//         "Failed to send reset instructions. Please try again.";
//       Alert.alert("Error", errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const closeSuccessModal = () => {
//     setIsSuccessModalVisible(false);
//     if (navigation && navigation.navigate) {
//       navigation.goBack();
//     } else {
//       console.warn("Navigation is undefined");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.content}>
//           <Text style={styles.title}>Reset Password</Text>
//           <Text style={styles.subtitle}>
//             Enter your email to receive reset instructions
//           </Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Your Email Address</Text>
//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               placeholder="Enter your email"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//               placeholderTextColor="#666"
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, isLoading && styles.buttonDisabled]}
//             onPress={handleResetPassword}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Send Reset Instructions</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.navigate("Login")}
//           >
//             <Text style={styles.backButtonText}>Back to Login</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Success Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={isSuccessModalVisible}
//           onRequestClose={closeSuccessModal}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Success</Text>
//               <Text style={styles.modalMessage}>
//                 Password reset instructions have been sent to your email.
//               </Text>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={closeSuccessModal}
//               >
//                 <Text style={styles.modalButtonText}>OK</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//   },
//   content: {
//     padding: 20,
//     width: "100%",
//     maxWidth: 400,
//     alignSelf: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#333",
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 15,
//     fontSize: 16,
//     color: "#333",
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     borderRadius: 8,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   backButton: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   backButtonText: {
//     color: "#007AFF",
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     width: 300,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalMessage: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: "#007AFF",
//     borderRadius: 8,
//     padding: 10,
//     alignItems: "center",
//     width: "100%",
//   },
//   modalButtonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });

// export default ForgotPasswordScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../src/api/apiClient";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation(); // Use navigation hook
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [errors, setErrors] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleResetPassword = async () => {
    setErrors("");

    if (!email) {
      setErrors("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrors("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/forgot-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsSuccessModalVisible(true);
    } catch (error) {
      // const errorMessage =
      //   error.response?.data?.error?.message ||
      //   error.response?.data?.message ||
      //   "Failed to send reset instructions. Please try again.";
      setErrors("Couldn't send mail. Please try again after sometime.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalVisible(false);
    navigation.goBack(); // Go back to previous screen
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email to receive reset instructions
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              inputMode="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#666"
            />
          </View>

          {errors ? <Text style={styles.errorText}>{errors}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Instructions</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("(auth)/login")}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isSuccessModalVisible}
          onRequestClose={closeSuccessModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Success</Text>
              <Text style={styles.modalMessage}>
                Password reset instructions have been sent to your email.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeSuccessModal}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: 300,
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
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
