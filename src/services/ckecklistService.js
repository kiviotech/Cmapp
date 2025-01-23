import {
  getChecklistItems,
  getChecklistItemById,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../api/repositories/checklistRepository";

export const fetchChecklistItems = async () => {
  try {
    const response = await getChecklistItems();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchChecklistItemById = async (id) => {
  try {
    const response = await getChecklistItemById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewChecklistItem = async (data) => {
  try {
    const response = await createChecklistItem(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingChecklistItem = async (id, data) => {
  try {
    const response = await updateChecklistItem(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExistingChecklistItem = async (id) => {
  try {
    const response = await deleteChecklistItem(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
