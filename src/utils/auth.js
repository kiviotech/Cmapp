import apiClient from "../api/apiClient";
import { deleteToken, saveToken, saveUserId } from "./storage";
import useAuthStore from "../../useAuthStore";

// export const login = async (email, password) => {
//   try {
//     const response = await apiClient.post("/auth/local", {
//       identifier: email,
//       password: password,
//     });

//     const { jwt, user } = response.data;

//     saveToken(jwt);
//     saveUserId(JSON.stringify(user.id));

//     const populatedResponse = await apiClient.get(
//       `/users/${user.id}?populate=*`,
//       {
//         headers: { Authorization: `Bearer ${jwt}` },
//       }
//     );

//     const populatedUserData = populatedResponse.data;
//     console.log("populatedata", populatedUserData);

//     const accessControlResponse = await apiClient.get(
//       `/designations/${populatedUserData.designation.id}?populate=*`,
//       {
//         headers: { Authorization: `Bearer ${jwt}` },
//       }
//     );

//     const accessControlId =
//       accessControlResponse.data.data.attributes.user_group.data.id;
//     console.log("id", accessControlId);

//     const specificAccessControlResponse = await apiClient.get(
//       `/user-groups/${accessControlId}?populate=*`,
//       {
//         headers: { Authorization: `Bearer ${jwt}` },
//       }
//     );
//     const permissions =
//       specificAccessControlResponse.data.data.attributes.access_control.data[0]
//         .attributes;

//     useAuthStore.setState({
//       user: {
//         id: populatedUserData.id,
//         username: populatedUserData.username,
//         email: populatedUserData.email,
//         provider: populatedUserData.provider,
//         confirmed: populatedUserData.confirmed,
//         blocked: populatedUserData.blocked,
//         createdAt: populatedUserData.createdAt,
//         updatedAt: populatedUserData.updatedAt,
//         token: jwt,
//       },
//       designation: populatedUserData.designation.Name,
//       role: populatedUserData.role.name,
//       projects: populatedUserData.projects.map((project) => ({
//         id: project.id,
//         name: project.name,
//         description: project.description,
//         deadline: project.deadline,
//         update_status: project.update_status,
//         createdAt: project.createdAt,
//         updatedAt: project.updatedAt,
//       })),
//       tasks: populatedUserData.tasks.map((task) => ({
//         id: task.id,
//         name: task.name,
//         description: task.description,
//         status: task.status,
//         deadline: task.deadline,
//         qa: task.qa,
//         qc: task.qc,
//         documents: task.documents,
//         rejection_comment: task.rejection_comment,
//         image_url: task.image_url,
//         createdAt: task.createdAt,
//         updatedAt: task.updatedAt,
//       })),
//       permissions,
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
    // Step 1: Authenticate and get JWT and user ID
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
    });
    const { jwt, user } = response.data;

    // Save JWT and user ID to storage
    saveToken(jwt);
    // saveUserId(JSON.stringify(user.id));

    // Step 2: Fetch populated user data with the user's ID
    const populatedResponse = await apiClient.get(
      `/users/${user.id}?populate=*`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const populatedUserData = populatedResponse.data;

    // Step 3: Fetch designation data to get user group ID
    const accessControlResponse = await apiClient.get(
      `/designations/${populatedUserData.designation.id}?populate=*`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const accessControlId =
      accessControlResponse.data.data.attributes.user_group.data.id;

    // Step 4: Fetch permissions from the user group data
    const specificAccessControlResponse = await apiClient.get(
      `/user-groups/${accessControlId}?populate=*`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const permissions =
      specificAccessControlResponse.data.data.attributes.access_control.data[0]
        .attributes;

    // Step 5: Update Zustand store with user data, designation, role, projects, tasks, and permissions
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
      designation: populatedUserData.designation.Name,
      role: populatedUserData.role.name,
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
      permissions,
    });

    // Return populated user data for any additional handling
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
  projectId
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
