import apiClient from "../api/apiClient";
import { deleteToken, saveToken, saveUserId } from "./storage";
import useAuthStore from "../../useAuthStore";

// export const login = async (email, password) => {
//   try {
//     // Initial login request to get JWT token and basic user info
//     const response = await apiClient.post("/auth/local", {
//       identifier: email,
//       password,
//     });
//     const { jwt, user } = response.data;

//     // Fetch additional user details, including designation
//     const populatedResponse = await apiClient.get(
//       `/users/${user.id}?populate[user_group][populate][designation]=*`,
//       {
//         headers: { Authorization: `Bearer ${jwt}` },
//       }
//     );
//     const populatedUserData = populatedResponse.data;

//     // Extract designation if available
//     const designation = populatedUserData.user_group?.designation?.Name || "";

//     // Store the user information and token in the Zustand store
//     useAuthStore.getState().setUser({
//       id: populatedUserData.id,
//       username: populatedUserData.username,
//       email: populatedUserData.email,
//       provider: populatedUserData.provider,
//       confirmed: populatedUserData.confirmed,
//       blocked: populatedUserData.blocked,
//       createdAt: populatedUserData.createdAt,
//       updatedAt: populatedUserData.updatedAt,
//       token: jwt, // Save the token in Zustand
//       designation, // Save the designation in Zustand
//     });

//     return {
//       user: populatedUserData,
//     };
//   } catch (error) {
//     console.error("Error during login API call:", error);
//     throw error;
//   }
// };

export const login = async (email, password) => {
  try {
    // Initial login request to get JWT token and basic user info
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password,
    });
    const { jwt, user } = response.data;

    // Fetch additional user details, including designation
    const populatedResponse = await apiClient.get(
      `/users/${user.id}?populate[user_group][populate][designation]=*`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const populatedUserData = populatedResponse.data;

    // Extract designation if available
    const designation = populatedUserData.user_group?.designation?.Name || "";

    // Store the user information and token in the Zustand store
    useAuthStore.getState().setUser({
      id: populatedUserData.id,
      username: populatedUserData.username,
      email: populatedUserData.email,
      provider: populatedUserData.provider,
      confirmed: populatedUserData.confirmed,
      blocked: populatedUserData.blocked,
      createdAt: populatedUserData.createdAt,
      updatedAt: populatedUserData.updatedAt,
      token: jwt, // Save the token in Zustand
      designation, // Save the designation in Zustand
    });

    return {
      user: populatedUserData,
    };
  } catch (error) {
    console.error("Error during login API call:", error);
    throw error;
  }
};

export const signup = async (
  name,
  email,
  password,
  socialSecurity,
  documents,
  projectId,
  subContractorId
) => {
  try {
    const payload = {
      data: {
        username: name,
        email: email,
        password: password,
        socialSecurityNumber: socialSecurity,
        project: { id: projectId },
        approver: null,
        documents: documents.map((docId) => ({ id: docId })),
        status: "pending",
        notification_status: "unread",
        sub_contractor: subContractorId,
      },
    };

    console.log("Signup Payload:", payload);
    const response = await apiClient.post("/registrations", payload);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error);
    throw error;
  }
};

export const logout = (jwt) => {
  deleteToken(jwt);
};

export const debugToken = async () => {
  const token = await getToken();
  if (token) {
    try {
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      console.log("Token payload:", payload);
      console.log("Token expiration:", new Date(payload.exp * 1000));
      console.log("Current time:", new Date());
      console.log("Is token expired:", Date.now() > payload.exp * 1000);
    } catch (e) {
      console.error("Error parsing token:", e);
    }
  } else {
    console.log("No token found");
  }
};
