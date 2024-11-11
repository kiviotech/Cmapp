import {
  getStandardTasks,
  getStandardTaskById,
  createStandardTask,
  updateStandardTask,
  deleteStandardTask,
} from "../api/repositories/standardTaskRepository";

export const fetchStandardTasks = async () => {
  try {
    const response = await getStandardTasks();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchStandardTaskById = async (id) => {
  try {
    const response = await getStandardTaskById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewStandardTask = async (data) => {
  try {
    const response = await createStandardTask(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingStandardTask = async (id, data) => {
  try {
    const response = await updateStandardTask(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeStandardTask = async (id) => {
  try {
    const response = await deleteStandardTask(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
