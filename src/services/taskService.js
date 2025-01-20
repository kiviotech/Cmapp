import {
  getTasks,
  getTaskById,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  getTasksByUserAndProject,
  getTasksByUser,
  getTaskDetailsById,
  getTaskByContractorId,
  getTasksBySubmissionId,
} from "../api/repositories/taskRepository";

// Fetch all tasks
export const fetchTasks = async (userId, page, pageSize, designation_value) => {
  try {
    const response = await getTasks(userId, page, pageSize, designation_value);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a specific task by ID
export const fetchTaskById = async (id) => {
  try {
    const response = await getTaskById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch task details by ID with assigned user and project info
export const fetchTaskDetailsById = async (id) => {
  try {
    const response = await getTaskDetailsById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch tasks assigned to a specific user and project
export const fetchTasksByUserAndProject = async (userId, projectId) => {
  try {
    const response = await getTasksByUserAndProject(userId, projectId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch tasks assigned to a specific user
export const fetchTasksByUser = async (userId) => {
  try {
    const response = await getTasksByUser(userId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await createTaskApi(taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing task by ID
export const updateTask = async (id, taskData) => {
  try {
    const response = await updateTaskApi(id, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a task by ID
export const deleteTask = async (id) => {
  try {
    const response = await deleteTaskApi(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTaskByContractorId = async (projectId, id) => {
  try {
    const response = await getTaskByContractorId(projectId, id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTasksBySubmissionId = async (id) => {
  try {
    const response = await getTasksBySubmissionId(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
