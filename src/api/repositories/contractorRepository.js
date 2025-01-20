import apiClient from "../apiClient";
import contractorEndpoints from "../endpoints/contractorEndpoints";

export const getContractors = () =>
  apiClient.get(contractorEndpoints.getContractors);

export const getContractorById = (id) =>
  apiClient.get(contractorEndpoints.getContractorById(id));

export const getContractorsByUserId = (userId) =>
  apiClient.get(contractorEndpoints.getContractorsByUserId(userId));

export const getContractorsIdByUserId = (userId) =>
  apiClient.get(contractorEndpoints.getContractorsIdByUserId(userId));

export const createContractor = (data) =>
  apiClient.post(contractorEndpoints.createContractor, data);

export const updateContractor = (id, data) =>
  apiClient.put(contractorEndpoints.updateContractor(id), data);

export const deleteContractor = (id) =>
  apiClient.delete(contractorEndpoints.deleteContractor(id));
