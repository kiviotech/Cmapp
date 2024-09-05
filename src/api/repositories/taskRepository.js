import apiClient from '../apiClient';
import taskEndpoints from '../endpoints/taskEndpoints';

export const getTasks = () => apiClient.get(taskEndpoints.getTasks);

export const getTaskById = id => apiClient.get(taskEndpoints.getTaskById(id));

export const createTask = data => apiClient.post(taskEndpoints.createTask, data);

export const updateTask = (id, data) => apiClient.put(taskEndpoints.updateTask(id), data);

export const deleteTask = id => apiClient.delete(taskEndpoints.deleteTask(id));

export const getTasksByUserAndProject = (id,projectId) => apiClient.get(taskEndpoints.getTasksByUserAndProject(id,projectId))

export const getTasksByUser = (id) => apiClient.get(taskEndpoints.getTasksByUser(id))