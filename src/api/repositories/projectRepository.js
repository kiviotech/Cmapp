import apiClient from '../apiClient';
import projectEndpoints from '../endpoints/projectEndpoints';

export const getProjects = () => apiClient.get(projectEndpoints.getProjects);

export const getProjectById = id => apiClient.get(projectEndpoints.getProjectById(id));

export const createProject = data => apiClient.post(projectEndpoints.createProject, data);

export const updateProject = (id, data) => apiClient.put(projectEndpoints.updateProject(id), data);

export const deleteProject = id => apiClient.delete(projectEndpoints.deleteProject(id));