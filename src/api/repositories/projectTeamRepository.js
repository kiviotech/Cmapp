import apiClient from "../apiClient";
import projectTeamEndpoints from "../endpoints/projectTeamEndpoints";

export const getProjectTeams = () =>
  apiClient.get(projectTeamEndpoints.getProjectTeams);

export const getProjectTeamById = (id) =>
  apiClient.get(projectTeamEndpoints.getProjectTeamById(id));

export const getProjectTeamIdByUserId = (userId) =>
  apiClient.get(projectTeamEndpoints.getProjectTeamIdByUserId(userId));

export const getProjectTeamManager = () =>
  apiClient.get(projectTeamEndpoints.getProjectTeamManager);

export const createProjectTeam = (data) =>
  apiClient.post(projectTeamEndpoints.createProjectTeam, data);

export const updateProjectTeam = (id, data) =>
  apiClient.put(projectTeamEndpoints.updateProjectTeam(id), data);

export const deleteProjectTeam = (id) =>
  apiClient.delete(projectTeamEndpoints.deleteProjectTeam(id));
