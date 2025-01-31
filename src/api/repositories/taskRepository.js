import apiClient from "../apiClient";
import taskEndpoints from "../endpoints/taskEndpoints";

export const getTasks = (userId, page, pageSize, designation_value) =>
  apiClient.get(
    taskEndpoints.getTasks(userId, page, pageSize, designation_value)
  );

export const getProjectAndDocumentByUserId = (userId, designation_value) =>
  apiClient.get(
    taskEndpoints.getProjectAndDocumentByUserId(userId, designation_value)
  );

export const getTaskByProjectIdAndUserId = (projectId) =>
  apiClient.get(taskEndpoints.getTaskByProjectIdAndUserId(projectId));

export const getTaskById = (id) => apiClient.get(taskEndpoints.getTaskById(id));

export const getTaskDetailsById = (id) =>
  apiClient.get(taskEndpoints.getTaskDetailsById(id));

export const createTask = (data) =>
  apiClient.post(taskEndpoints.createTask, data);

export const updateTask = (id, data) =>
  apiClient.put(taskEndpoints.updateTask(id), data);

export const deleteTask = (id) =>
  apiClient.delete(taskEndpoints.deleteTask(id));

export const getTasksByUserAndProject = (id, projectId) =>
  apiClient.get(taskEndpoints.getTasksByUserAndProject(id, projectId));

export const getTasksByUser = (id) =>
  apiClient.get(taskEndpoints.getTasksByUser(id));

export const getTaskByContractorId = (projectId, userId) =>
  apiClient.get(taskEndpoints.getTaskByContractorId(projectId, userId));

export const getTasksBySubmissionId = (id) =>
  apiClient.get(taskEndpoints.getTasksBySubmissionId(id));

export const getTasksByProjectNameAndStatus = (
  userId,
  projectName,
  status,
  page,
  pageSize,
  designation_value
) =>
  apiClient.get(
    taskEndpoints.getTasksByProjectNameAndStatus(
      userId,
      projectName,
      status,
      page,
      pageSize,
      designation_value
    )
  );
