import {
  getUserGroupsWithContractorRole,
  getUserGroupById,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
} from "../api/repositories/userGroupRepository";

export const fetchUserGroupsWithContractorRole = async () => {
  try {
    const response = await getUserGroupsWithContractorRole();
    return response.data;
  } catch (error) {
    console.error("Error fetching user groups with 'Contractor' role:", error);
    throw error;
  }
};

export const fetchUserGroupById = async (id) => {
  try {
    const response = await getUserGroupById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user group with ID ${id}:`, error);
    throw error;
  }
};

export const createNewUserGroup = async (data) => {
  try {
    const response = await createUserGroup(data);
    return response.data;
  } catch (error) {
    console.error("Error creating user group:", error);
    throw error;
  }
};

export const updateUserGroupById = async (id, data) => {
  try {
    const response = await updateUserGroup(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user group with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUserGroupById = async (id) => {
  try {
    const response = await deleteUserGroup(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user group with ID ${id}:`, error);
    throw error;
  }
};
