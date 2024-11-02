import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../api/repositories/projectRepository";

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await getProjects();
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Fetch a specific project by ID
export const fetchProjectById = async (id) => {
  try {
    const response = await getProjectById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};

// Create a new project
export const createNewProject = async (projectData) => {
  try {
    const response = await createProject(projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Update an existing project by ID
export const updateExistingProject = async (id, updatedData) => {
  try {
    const response = await updateProject(id, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    throw error;
  }
};

// Delete a project by ID
export const deleteProjectById = async (id) => {
  try {
    const response = await deleteProject(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
};
