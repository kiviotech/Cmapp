import {
  getStandardInspectionForms,
  getStandardInspectionFormById,
  createStandardInspectionForm,
  updateStandardInspectionForm,
  deleteStandardInspectionForm,
} from "../api/repositories/standardInspectionFormRepository";

export const fetchStandardInspectionForms = async () => {
  try {
    const response = await getStandardInspectionForms();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchStandardInspectionFormById = async (id) => {
  try {
    const response = await getStandardInspectionFormById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewStandardInspectionForm = async (data) => {
  try {
    const response = await createStandardInspectionForm(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingStandardInspectionForm = async (id, data) => {
  try {
    const response = await updateStandardInspectionForm(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExistingStandardInspectionForm = async (id) => {
  try {
    const response = await deleteStandardInspectionForm(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
