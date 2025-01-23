import {
  getProjectInspections,
  getProjectInspectionById,
  createProjectInspection,
  updateProjectInspection,
  deleteProjectInspection,
  getProjectInspectionsByProjectId,
} from "../api/repositories/projectInspectionRepository";

export const fetchProjectInspections = async () => {
  try {
    const response = await getProjectInspections();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectInspectionById = async (id) => {
  try {
    const response = await getProjectInspectionById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewProjectInspection = async (data) => {
  try {
    const response = await createProjectInspection(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingProjectInspection = async (id, data) => {
  try {
    const response = await updateProjectInspection(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExistingProjectInspection = async (id) => {
  try {
    const response = await deleteProjectInspection(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectInspectionsByProjectId = async (
  projectId,
  subcategory
) => {
  try {
    const response = await getProjectInspectionsByProjectId(
      projectId,
      subcategory
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
