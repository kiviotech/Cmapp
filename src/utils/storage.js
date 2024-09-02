// Save the token securely
export function saveToken(token) {
  localStorage.setItem("userToken", token);
}

// Retrieve the token securely
export function getToken() {
  return localStorage.getItem("userToken");
}

// Delete the token securely
export function deleteToken() {
  try {
    localStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error deleting token", error);
  }
}
