import {
  getSubContractors,
  getSubContractorById,
  createSubContractor,
  updateSubContractor,
  deleteSubContractor,
} from "../api/repositories/subContractorRepository";

export const fetchSubContractors = async () => {
  try {
    const response = await getSubContractors();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubContractorById = async (id) => {
  try {
    const response = await getSubContractorById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSubContractorEntry = async (data) => {
  try {
    const response = await createSubContractor(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubContractorEntry = async (id, data) => {
  try {
    const response = await updateSubContractor(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubContractorEntry = async (id) => {
  try {
    const response = await deleteSubContractor(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
