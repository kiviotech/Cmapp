const projectEndpoints = {
  getProjects: "/projects?populate=*",
  getProjectById: (id) => `/projects/${id}?populate=*`,
  createProject: "/projects",
  updateProject: (id) => `/projects/${id}`,
  deleteProject: (id) => `/projects/${id}`,
};

export default projectEndpoints;
