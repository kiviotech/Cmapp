// Save the token securely
export function saveToken(token) {
  localStorage.setItem("userToken", token);
  
}

// Retrieve the token securely
export function getToken() {
  return localStorage.getItem("userToken");
}

// Save the id securely
export function saveUserId(id) {
  localStorage.setItem("id", id);
  
}
// Retrieve the id securely
export function getUserId() {
  return localStorage.getItem("id");
}

// Delete the token securely
export function deleteToken() {
  try {
    localStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error deleting token", error);
  }
}
