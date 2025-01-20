import {
  getContractors,
  getContractorById,
  getContractorsByUserId,
  createContractor,
  updateContractor,
  deleteContractor,
  getContractorsIdByUserId,
} from "../api/repositories/contractorRepository";

export const fetchContractors = async () => {
  try {
    const response = await getContractors();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchContractorById = async (id) => {
  try {
    const response = await getContractorById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchContractorsByUserId = async (userId) => {
  try {
    const response = await getContractorsByUserId(userId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchContractorsIdByUserId = async (userId) => {
  try {
    const response = await getContractorsIdByUserId(userId);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const createNewContractor = async (data) => {
  try {
    const response = await createContractor(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingContractor = async (id, data) => {
  try {
    const response = await updateContractor(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeContractor = async (id) => {
  try {
    const response = await deleteContractor(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
