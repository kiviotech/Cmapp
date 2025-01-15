const projectEndpoints = {
  getProjects: "/projects?populate=*",

  getProjectById: (id) => `/projects/${id}?populate=*`,

  getAssignedProjectById: (id) =>
    `/projects?populate[0]=tasks&populate[tasks][populate][assigned_to]=*&filters[tasks][assigned_to][id][$eq]=${id}`,

  // getProjectDetailsById: (id) =>
  //   `/projects?filters[approver][id][$eq]=${id}&populate=tasks`,

  getProjectDetailsById: (id) =>
    `/projects?filters[approvers][id][$eq]=${id}&populate[0]=tasks&populate[1]=approvers`,

  createProject: "/projects",

  updateProject: (id) => `/projects/${id}`,

  deleteProject: (id) => `/projects/${id}`,
};

export default projectEndpoints;
