import apiClient from "../apiClient";
import standardTaskEndpoints from "../endpoints/standardTaskEndpoints";

export const getStandardTasks = () =>
  apiClient.get(standardTaskEndpoints.getStandardTasks);

export const getStandardTaskById = (id) =>
  apiClient.get(standardTaskEndpoints.getStandardTaskById(id));

export const createStandardTask = (data) =>
  apiClient.post(standardTaskEndpoints.createStandardTask, data);

export const updateStandardTask = (id, data) =>
  apiClient.put(standardTaskEndpoints.updateStandardTask(id), data);

export const deleteStandardTask = (id) =>
  apiClient.delete(standardTaskEndpoints.deleteStandardTask(id));
