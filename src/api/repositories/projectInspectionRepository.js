import apiClient from "../apiClient";
import projectInspectionEndpoints from "../endpoints/projectInspectionEndpoints";

export const getProjectInspections = () =>
  apiClient.get(projectInspectionEndpoints.getProjectInspections);

export const getProjectInspectionById = (id) =>
  apiClient.get(projectInspectionEndpoints.getProjectInspectionById(id));

export const createProjectInspection = (data) =>
  apiClient.post(projectInspectionEndpoints.createProjectInspection, data);

export const updateProjectInspection = (id, data) =>
  apiClient.put(projectInspectionEndpoints.updateProjectInspection(id), data);

export const deleteProjectInspection = (id) =>
  apiClient.delete(projectInspectionEndpoints.deleteProjectInspection(id));

export const getProjectInspectionsByProjectId = (projectId) =>
  apiClient.get(
    projectInspectionEndpoints.getProjectInspectionsByProjectId(projectId)
  );
