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
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    // Add some logging to debug token retrieval
    // console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

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
