import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAuthenticatedUserWithPopulate,
  getRegistrationByEmail,
  getProjectByUserId,
  getTaskByUserId
} from "../api/repositories/userRepository";

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await getUsers();
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch a specific user by ID
export const fetchUserById = async (id) => {
  try {
    const response = await getUserById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Create a new user
export const createNewUser = async (data) => {
  try {
    const response = await createUser(data);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update an existing user by ID
export const updateUserById = async (id, data) => {
  try {
    const response = await updateUser(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// Delete a user by ID
export const deleteUserById = async (id) => {
  try {
    const response = await deleteUser(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

// Fetch the authenticated user with specified fields populated
export const fetchAuthenticatedUserWithPopulate = async (fields) => {
  try {
    const response = await getAuthenticatedUserWithPopulate(fields);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching authenticated user with populated fields:",
      error
    );
    throw error;
  }
};

// Fetch registration by email
export const fetchRegistrationByEmail = async (email) => {
  try {
    const response = await getRegistrationByEmail(email);
    return response.data;
  } catch (error) {
    console.error(`Error fetching registration for email ${email}:`, error);
    throw error;
  }
};

export const fetchProjectByUserId = async (id) => {
  try {
    const response = await getProjectByUserId(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects for user ID ${id}:`, error);
    throw error;
  }
};


export const fetchTasksByUserId = async (id) => {
  try {
    const response = await getTaskByUserId(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for user ID ${id}:`, error);
    throw error;
  }
};