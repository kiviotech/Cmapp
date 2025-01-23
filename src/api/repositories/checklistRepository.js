import apiClient from "../apiClient";
import checklistEndpoints from "../endpoints/checklistEndpoints";

export const getChecklistItems = () =>
  apiClient.get(checklistEndpoints.getChecklistItems);

export const getChecklistItemById = (id) =>
  apiClient.get(checklistEndpoints.getChecklistItemById(id));

export const createChecklistItem = (data) =>
  apiClient.post(checklistEndpoints.createChecklistItem, data);

export const updateChecklistItem = (id, data) =>
  apiClient.put(checklistEndpoints.updateChecklistItem(id), data);

export const deleteChecklistItem = (id) =>
  apiClient.delete(checklistEndpoints.deleteChecklistItem(id));
