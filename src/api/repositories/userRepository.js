import apiClient from "../apiClient";
import userEndpoints from "../endpoints/userEndpoints";

export const getUsers = () => apiClient.get(userEndpoints.getUsers);

export const getUserById = (id) => apiClient.get(userEndpoints.getUserById(id));

export const createUser = (data) =>
  apiClient.post(userEndpoints.createUser, data);

export const updateUser = (id, data) =>
  apiClient.put(userEndpoints.updateUser(id), data);

export const deleteUser = (id) =>
  apiClient.delete(userEndpoints.deleteUser(id));

export const loginUser = (data) =>
  apiClient.post(userEndpoints.loginUser, data);

export const getAuthenticatedUser = () =>
  apiClient.get(userEndpoints.getAuthenticatedUser);

export const getAuthenticatedUserWithPopulate = (fields) =>
  apiClient.get(userEndpoints.getAuthenticatedUserWithPopulate(fields));

export const resetPassword = (data) =>
  apiClient.post(userEndpoints.resetPassword, data);

export const forgotPassword = (data) =>
  apiClient.post(userEndpoints.forgotPassword, data);

export const changePassword = (data) =>
  apiClient.post(userEndpoints.changePassowrd, data);

export const getRoles = () => apiClient.get(userEndpoints.getRoles);

export const getRoleById = (id) => apiClient.get(userEndpoints.getRoleById(id));

export const updateUserRole = (id, data) =>
  apiClient.put(userEndpoints.updateUserRole(id), data);

export const getRegistrationByEmail = (email) =>
  apiClient.get(userEndpoints.getRegistrationByEmail(email));
