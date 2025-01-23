import {
  getInspectionSections,
  getInspectionSectionById,
  createInspectionSection,
  updateInspectionSection,
} from "../api/repositories/inspectionSectionRepository";

export const fetchInspectionSections = async () => {
  try {
    const response = await getInspectionSections();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchInspectionSectionById = async (id) => {
  try {
    const response = await getInspectionSectionById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewInspectionSection = async (data) => {
  try {
    const response = await createInspectionSection(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingInspectionSection = async (id, data) => {
  try {
    const response = await updateInspectionSection(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
