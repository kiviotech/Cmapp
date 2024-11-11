import apiClient from "../apiClient";
import userGroupEndpoints from "../endpoints/userGroupEndpoints";

export const getUserGroupsWithContractorRole = async () => {
  return await apiClient.get(
    userGroupEndpoints.getUserGroupsWithContractorRole
  );
};

export const getUserGroupById = async (id) => {
  return await apiClient.get(userGroupEndpoints.getUserGroupById(id));
};

export const createUserGroup = async (data) => {
  return await apiClient.post(userGroupEndpoints.createUserGroup, data);
};

export const updateUserGroup = async (id, data) => {
  return await apiClient.put(userGroupEndpoints.updateUserGroup(id), data);
};

export const deleteUserGroup = async (id) => {
  return await apiClient.delete(userGroupEndpoints.deleteUserGroup(id));
};
