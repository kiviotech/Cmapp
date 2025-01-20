import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAuthenticatedUserWithPopulate,
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
