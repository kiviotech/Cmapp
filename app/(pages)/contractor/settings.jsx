import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import BottomNavigation from "./BottomNavigation ";
import { logout } from "../../../src/utils/auth";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../useAuthStore";

const { width, height } = Dimensions.get("window");

const Settings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const navigation = useNavigation();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    logout();
    clearAuth();
    navigation.navigate("(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        <View
          style={[
            styles.section,
            {
              borderBottomWidth: 1,
              borderBottomColor: "#CACACA",
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("(pages)/contractor/PersonalDetailsScreen")
            }
          >
            <Text style={styles.itemText}>Edit profile</Text>
            <FontAwesome
              style={{ color: colors.blackColor }}
              name="chevron-right"
              size={15}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("(pages)/contractor/ChangePasswordScreen")
            }
          >
            <Text style={styles.itemText}>Change password</Text>
            <FontAwesome
              style={{ color: colors.blackColor }}
              name="chevron-right"
              size={15}
            />
          </TouchableOpacity>

          <View style={styles.item}>
            <Text style={styles.itemText}>Push notifications</Text>
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={isEnabled ? colors.whiteColor : colors.whiteColor}
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={styles.switch}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>About us</Text>
            <FontAwesome
              style={{ color: colors.blackColor }}
              name="chevron-right"
              size={15}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Privacy policy</Text>
            <FontAwesome
              style={{ color: colors.blackColor }}
              name="chevron-right"
              size={15}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Terms and conditions</Text>
            <FontAwesome
              style={{ color: colors.blackColor }}
              name="chevron-right"
              size={15}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.05,
    backgroundColor: colors.background,
    paddingBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: colors.blackColor,
  },
  section: {
    marginBottom: height * 0.03,
    paddingBottom: height * 0.015,
  },
  switchContainer: {
    height: height * 0.06,
    justifyContent: "center",
    paddingRight: width * 0.05,
  },
  switch: {
    transform: [{ scale: 1.5 }], // Slightly smaller switch for mobile view
  },
  sectionTitle: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
    color: "#ADADAD",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.018,
  },
  itemText: {
    fontSize: width * 0.045,
    color: colors.blackColor,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: height * 0.015,
    borderRadius: 10,
    marginTop: height * 0.02,
  },
  logoutText: {
    fontSize: width * 0.045,
    color: "#FF3B30",
    marginLeft: width * 0.02,
    fontWeight: "bold",
  },
});
