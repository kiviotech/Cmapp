import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../api/repositories/taskRepository';

export const fetchTasks = async () => {
  try {
    const response = await getTasks();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTaskById = async id => {
  try {
    const response = await getTaskById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
