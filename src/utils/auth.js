import apiClient from "../api/apiClient";
import { deleteToken, saveToken, saveUserId } from "./storage";
import useAuthStore from "../../useAuthStore";

export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
    });

    // Extract JWT and basic user data from the login response
    const { jwt, user } = response.data;

    // Save the JWT for future authenticated requests
    saveToken(jwt); // Implement saveToken to store the token in a secure storage
    saveUserId(JSON.stringify(user.id)); // Implement saveUserId as needed

    // Fetch full populated user data
    const populatedResponse = await apiClient.get(
      `/users/${user.id}?populate=*`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );

    const populatedUserData = populatedResponse.data;

    // Log populated user data for debugging
    console.log("Populated User Data:", populatedUserData);

    // Update Zustand store with all user details
    useAuthStore.setState({
      user: {
        id: populatedUserData.id,
        username: populatedUserData.username,
        email: populatedUserData.email,
        provider: populatedUserData.provider,
        confirmed: populatedUserData.confirmed,
        blocked: populatedUserData.blocked,
        createdAt: populatedUserData.createdAt,
        updatedAt: populatedUserData.updatedAt,
        token: jwt,
      },
      designation: populatedUserData.designation.Name, // User's designation
      role: populatedUserData.role.name, // User's role
      projects: populatedUserData.projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        deadline: project.deadline,
        update_status: project.update_status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
      tasks: populatedUserData.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        status: task.status,
        deadline: task.deadline,
        qa: task.qa,
        qc: task.qc,
        documents: task.documents,
        rejection_comment: task.rejection_comment,
        image_url: task.image_url,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    });

    // Return the user data with all related details
    return {
      user: populatedUserData,
    };
  } catch (error) {
    console.error("Error during login API call:", error);
    throw error;
  }
};

export const fetchUserRelatedData = async (userId, token) => {
  try {
    const response = await apiClient.get(
      `/users/${userId}?populate=designation`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const designation = response.data.designation;

    // Fetch user access permissions and pass the designation ID
    const accessDesignationData = await fetchUserGroup(designation.id, token);

    return {
      designation,
      permissions: accessDesignationData,
    };
  } catch (error) {
    console.error("Error fetching related data:", error);
    throw error;
  }
};

export const fetchUserGroup = async (designationId, token) => {
  try {
    const response = await apiClient.get(
      `/designations/${designationId}?populate=user_group`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user_group = response.data.data.attributes.user_group.data.id;

    const accessUserGroupData = await fetchUserPermission(user_group, token);

    return accessUserGroupData;
  } catch (error) {
    console.error("Error fetching user group:", error);
    throw error;
  }
};

export const fetchUserPermission = async (user_group, token) => {
  try {
    const response = await apiClient.get(
      `/user-groups/${user_group}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const permissions =
      response.data.data.attributes.access_control.data[0].attributes;

    return permissions;
  } catch (error) {
    console.error("Error fetching access permission", error);
    throw error;
  }
};

// export const signup = async (
//   name,
//   email,
//   password,
//   socialSecurity,
//   contractorLicense,
//   projectId
// ) => {
//   try {
//     const response = await apiClient.post("/registrations", {
//       data: {
//         fullName: name,
//         email: email,
//         password: password,
//         socialSecurityNumber: socialSecurity,
//         project: projectId,
//         approver: "",
//         documents: [],
//         // documents: contractorLicense[0].uri,
//         // documents: contractorLicense,
//         status: "pending",
//         password: password,
//       },
//       // {
//       // "data": {
//       //   "fullName": "string",
//       //   "socialSecurityNumber": "123456789",
//       //   "email": "user@example.com",
//       //   "project": "string or id",
//       //   "documents": [
//       //     "string or id",
//       //     "string or id"
//       //   ],
//       //   "approver": "string or id",
//       //   "status": "approved",
//       //   "password": "string"
//       // }
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// export const signup = async (
//   name,
//   email,
//   password,
//   socialSecurity,
//   documents,
//   projectId
// ) => {
//   try {
//     // Ensure the payload structure is as expected by Strapi
//     const payload = {
//       data: {
//         fullName: name,
//         email: email,
//         password: password,
//         socialSecurityNumber: socialSecurity,
//         project: { id: projectId }, // Pass project as an object with ID
//         approver: null, // Set approver as null if no approver is specified
//         documents: documents.map((docId) => ({ id: docId })), // Ensure documents array contains objects with IDs
//         status: "pending",
//       },
//     };

//     console.log("Signup Payload:", payload); // Debugging: log payload before sending
//     const response = await apiClient.post("/registrations", payload);
//     return response.data;
//   } catch (error) {
//     console.error("Error during registration:", error.response?.data || error);
//     throw error;
//   }
// };

export const signup = async (
  name,
  email,
  password,
  socialSecurity,
  documents,
  projectId
) => {
  try {
    // Prepare the payload with `username` instead of `fullName`
    const payload = {
      data: {
        username: name, // Store `fullName` as `username`
        email: email,
        password: password,
        socialSecurityNumber: socialSecurity,
        project: { id: projectId }, // Pass project as an object with ID
        approver: null, // Set approver as null if no approver is specified
        documents: documents.map((docId) => ({ id: docId })), // Ensure documents array contains objects with IDs
        status: "pending",
      },
    };

    console.log("Signup Payload:", payload); // Debugging: log payload before sending
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
