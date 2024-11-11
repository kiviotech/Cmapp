const taskEndpoints = {
  getTasks: "/tasks?populate=*",
  getTaskById: (id) => `/tasks/${id}?populate=*`,
  getTaskDetailsById: (id) =>
    `tasks?populate[0]=assigned_to&populate[1]=project&filters[assigned_to][id][$eq]=${id}`,
  createTask: "/tasks",
  updateTask: (id) => `/tasks/${id}`,
  deleteTask: (id) => `/tasks/${id}`,
  getTasksByUserAndProject: (userId, projectId) =>
    `/tasks?filters[assigned_to][$eq]=${userId}&filters[project][$eq]=${projectId}&populate=*`,

  getTasksByUser: (userId, projectId) => `/tasks?populate=*`,
  getTaskByContractorId: (projectId, id) =>
    `/tasks?filters[project][id][$eq]=${projectId}&filters[contractor][id][$eq]=${id}&populate=*`,
};

export default taskEndpoints;
