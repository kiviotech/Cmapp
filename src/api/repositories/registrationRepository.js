import apiClient from "../apiClient";
import registrationEndpoints from "../endpoints/registrationEndpoints";

export const getRegistrations = () =>
  apiClient.get(registrationEndpoints.getRegistrations);

export const getRegistrationById = (id) =>
  apiClient.get(registrationEndpoints.getRegistrationById(id));

export const createRegistration = (data) =>
  apiClient.post(registrationEndpoints.createRegistration, data);

export const updateRegistration = (id, data) =>
  apiClient.put(registrationEndpoints.updateRegistration(id), data);

export const deleteRegistration = (id) =>
  apiClient.delete(registrationEndpoints.deleteRegistration(id));
