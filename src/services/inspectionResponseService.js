import {
  getInspectionForms,
  getInspectionFormById,
  createInspectionForm,
  updateInspectionForm,
  deleteInspectionForm,
  submitInspectionForm,
  getFormResponses,
} from "../api/repositories/inspectionResponseRepository";

export const fetchInspectionForms = async () => {
  try {
    const response = await getInspectionForms();
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inspection forms: " + error.message);
  }
};

export const fetchInspectionFormById = async (id) => {
  try {
    const response = await getInspectionFormById(id);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inspection form: " + error.message);
  }
};

export const createNewInspectionForm = async (formData) => {
  try {
    const response = await createInspectionForm(formData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create inspection form: " + error.message);
  }
};

export const updateExistingInspectionForm = async (id, formData) => {
  try {
    const response = await updateInspectionForm(id, formData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update inspection form: " + error.message);
  }
};

export const deleteExistingInspectionForm = async (id) => {
  try {
    const response = await deleteInspectionForm(id);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete inspection form: " + error.message);
  }
};

export const submitForm = async (id) => {
  try {
    const response = await submitInspectionForm(id);
    return response.data;
  } catch (error) {
    throw new Error("Failed to submit inspection form: " + error.message);
  }
};

export const fetchFormResponses = async (id) => {
  try {
    const response = await getFormResponses(id);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch form responses: " + error.message);
  }
};
