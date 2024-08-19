import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../api/repositories/projectRepository';

export const fetchProjects = async () => {
  try {
    const response = await getProjects();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectById = async id => {
  try {
    const response = await getProjectById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
