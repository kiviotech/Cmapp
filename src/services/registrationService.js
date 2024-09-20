import {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from "../api/repositories/registrationRepository";

export const fetchRegistrations = async () => {
  try {
    const response = await getRegistrations();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRegistrationById = async (id) => {
  try {
    const response = await getRegistrationById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewRegistration = async (data) => {
  try {
    const response = await createRegistration(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingRegistration = async (id, data) => {
  try {
    const response = await updateRegistration(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeRegistration = async (id) => {
  try {
    const response = await deleteRegistration(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
