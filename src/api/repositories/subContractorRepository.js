import apiClient from "../apiClient";
import subContractorEndpoints from "../endpoints/subContractorEndpoints";

export const getSubContractors = () =>
  apiClient.get(subContractorEndpoints.getSubContractors);

export const getSubContractorById = (id) =>
  apiClient.get(subContractorEndpoints.getSubContractorById(id));

export const createSubContractor = (data) =>
  apiClient.post(subContractorEndpoints.createSubContractor, data);

export const updateSubContractor = (id, data) =>
  apiClient.put(subContractorEndpoints.updateSubContractor(id), data);

export const deleteSubContractor = (id) =>
  apiClient.delete(subContractorEndpoints.deleteSubContractor(id));
