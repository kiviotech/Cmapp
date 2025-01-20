import {
  getProjectTeams,
  getProjectTeamById,
  getProjectTeamIdByUserId,
  getProjectTeamManager,
  createProjectTeam,
  updateProjectTeam,
  deleteProjectTeam,
} from "../api/repositories/projectTeamRepository";

export const fetchProjectTeams = async () => {
  try {
    const response = await getProjectTeams();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectTeamById = async (id) => {
  try {
    const response = await getProjectTeamById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectTeamIdByUserId = async (userId) => {
  try {
    const response = await getProjectTeamIdByUserId(userId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectTeamManager = async (designation) => {
  try {
    const response = await getProjectTeamManager(designation);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewProjectTeam = async (data) => {
  try {
    const response = await createProjectTeam(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingProjectTeam = async (id, data) => {
  try {
    const response = await updateProjectTeam(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeProjectTeam = async (id) => {
  try {
    const response = await deleteProjectTeam(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
