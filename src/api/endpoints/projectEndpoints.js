const projectEndpoints = {
  getProjects: "/projects?populate=*",
  getProjectById: (id) => `/projects/${id}?populate=*`,
  getAssignedProjectById: (id) =>
    `/projects?populate=tasks.assigned_to&filters[tasks][assigned_to][id][$eq]=${id}`,
  createProject: "/projects",
  updateProject: (id) => `/projects/${id}`,
  deleteProject: (id) => `/projects/${id}`,
};

export default projectEndpoints;
