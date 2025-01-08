// import React, { useState } from 'react';
// import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const PersonalDetailsScreen = () => {
//   // State variables for dynamic data
//   const [name, setName] = useState("Dan Smith");
//   const [email, setEmail] = useState("abcdefg@domain.com");
//   const [phoneNumber, setPhoneNumber] = useState("+1 xxx-xxx-xxxxx");

//   return (
//     <SafeAreaView style={styles.AreaContainer}>
//         <ScrollView>
//         <View style={styles.container}>
//       <View style={styles.header}>
//         <Ionicons name="arrow-back" size={24} color="black" />
//         <Text style={styles.headerText}>Personal Details</Text>
//       </View>

//       <View style={styles.profileImageContainer}>
//         <Image
//           source={{ uri: 'https://example.com/profile-image.jpg' }} // Replace with actual image URL
//           style={styles.profileImage}
//         />
//         <TouchableOpacity style={styles.editIconContainer}>
//           <Ionicons name="pencil" size={14} color="white" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Name</Text>
//         <TextInput
//           style={styles.input}
//           value={name}
//           onChangeText={setName} // Allows dynamic updating
//           editable={true} // Make the field editable
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>E-mail</Text>
//         <View style={styles.inputWithButton}>
//           <TextInput
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail} // Allows dynamic updating
//             editable={true}
//           />
//           <TouchableOpacity>
//             <Text style={styles.actionText}>verify</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Phone number</Text>
//         <View style={styles.inputWithButton}>
//           <TextInput
//             style={styles.input}
//             value={phoneNumber}
//             onChangeText={setPhoneNumber} // Allows dynamic updating
//             editable={true}
//           />
//           <TouchableOpacity>
//             <Text style={styles.actionText}>update</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//         </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({

//     AreaContainer: {
//         flex: 1,
//         padding: 5,
//         marginTop: 20,
//         //  backgroundColor: '#fff',
//         width: "100%"

//     },
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1C1C1E',
//     marginLeft: 10,
//   },
//   profileImageContainer: {
//     alignSelf: 'center',
//     position: 'relative',
//     marginBottom: 30,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   editIconContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#4CAF50',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     color: '#1C1C1E',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#E8E8E8',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     color: '#1C1C1E',
//   },
// //   inputWithButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 8,
// //     paddingHorizontal: 10,
// //     borderWidth: 1,
// //     borderColor: '#E0E0E0',
// //   },
//   actionText: {
//     color: '#007BFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

// export default PersonalDetailsScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../../../useAuthStore";
import { useNavigation } from "expo-router";

const PersonalDetailsScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation();
  const { user } = useAuthStore();
  console.log(user);

  const validateEmail = (text) => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(text)) {
      setError("");
    } else {
      setError("Please enter a valid email address");
    }
    setEmail(text);
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate("(pages)/contractor/settings")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Personal Details</Text>
          </View>

          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
              }} // Replace with actual image URL
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editIconContainer}>
              <Ionicons name="pencil" size={14} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={user.username}
              onChangeText={setName}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={validateEmail}
              editable={false}
              keyboardType="email-address"
            />
            {/* <TouchableOpacity style={styles.buttonContainer}>
                            <Text style={styles.actionText}>verify</Text>
                        </TouchableOpacity> */}
          </View>

          {/* <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone number</Text>
                        <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            editable={true}
                            keyboardType='phone-pad'
                            maxLength={10}
                        />
                        <TouchableOpacity style={styles.buttonContainer}>
                            <Text style={styles.actionText}>update</Text>
                        </TouchableOpacity>
                    </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    paddingTop: 20,
    // marginTop: 20,
    backgroundColor: "#fff",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginLeft: 80,
  },
  profileImageContainer: {
    alignSelf: "center",
    // position: "relative",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#1C1C1E",
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#E8E8E8",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#1C1C1E",
  },
  buttonContainer: {
    position: "absolute",
    right: 20,
    top: "65%",
    transform: [{ translateY: -10 }],
  },
  actionText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default PersonalDetailsScreen;