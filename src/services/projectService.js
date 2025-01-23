import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAssignedProjectById,
  getProjectDetailsById,
  getProjectsByContractorEmail,
  getProjectWithTaskDetails,
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

// Fetch assigned projects by user ID
export const fetchAssignedProjectById = async (id) => {
  try {
    const response = await getAssignedProjectById(id);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching assigned projects for user with ID ${id}:`,
      error
    );
    throw error;
  }
};

// Fetch project details by approver ID
export const fetchProjectDetailsByApproverId = async (id) => {
  try {
    const response = await getProjectDetailsById(id);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching project details for approver with ID ${id}:`,
      error
    );
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

// Fetch projects by contractor email
export const fetchProjectsByContractorEmail = async (email) => {
  try {
    const response = await getProjectsByContractorEmail(email);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects for contractor ${email}:`, error);
    throw error;
  }
};

// Fetch project with all task details
export const fetchProjectWithTaskDetails = async (projectId) => {
  try {
    const response = await getProjectWithTaskDetails(projectId);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching project details with ID ${projectId}:`,
      error
    );
    throw error;
  }
};
