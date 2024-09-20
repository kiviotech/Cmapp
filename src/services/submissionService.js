// submissionService.js

import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} from "../api/repositories/submissionRepository";

export const fetchSubmissions = async () => {
  try {
    const response = await getSubmissions();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubmissionById = async (id) => {
  try {
    const response = await getSubmissionById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewSubmission = async (data) => {
  try {
    const response = await createSubmission(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingSubmission = async (id, data) => {
  try {
    const response = await updateSubmission(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeSubmission = async (id) => {
  try {
    const response = await deleteSubmission(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
