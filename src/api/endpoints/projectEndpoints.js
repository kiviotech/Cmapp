const projectEndpoints = {
  getProjects: '/projects',
  getProjectById: id => `/projects/${id}`,
  createProject: '/projects',
  updateProject: id => `/projects/${id}`,
  deleteProject: id => `/projects/${id}`,
};

export default projectEndpoints;
