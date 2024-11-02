import {
  getTasks,
  getTaskById,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from "../api/repositories/taskRepository";

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await getTasks();
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
