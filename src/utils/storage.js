import AsyncStorage from "@react-native-async-storage/async-storage";

// Save the token securely
export async function saveToken(token) {
  try {
    await AsyncStorage.setItem("userToken", token);
  } catch (error) {
    console.error("Error saving token", error);
  }
}

// Retrieve the token securely
export async function getToken() {
  try {
    return await AsyncStorage.getItem("userToken");
  } catch (error) {
    console.error("Error retrieving token", error);
  }
}

// Save the id securely
export async function saveUserId(id) {
  try {
    await AsyncStorage.setItem("id", id);
  } catch (error) {
    console.error("Error saving user ID", error);
  }
}

// Retrieve the id securely
export async function getUserId() {
  try {
    return await AsyncStorage.getItem("id");
  } catch (error) {
    console.error("Error retrieving user ID", error);
  }
}

// Delete the token securely
export async function deleteToken() {
  try {
    await AsyncStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error deleting token", error);
  }
}
