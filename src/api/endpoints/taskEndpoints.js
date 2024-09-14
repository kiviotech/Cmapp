const taskEndpoints = {
  getTasks: '/tasks?populate=*',
  getTaskById: id => `/tasks/${id}?populate=*`,
  createTask: '/tasks',
  updateTask: id => `/tasks/${id}`,
  deleteTask: id => `/tasks/${id}`,

  // New endpoint for fetching tasks by userId and projectId
  getTasksByUserAndProject: (userId, projectId) => `/tasks?filters[assigned_to][$eq]=${userId}&filters[project][$eq]=${projectId}&populate=*`,

  getTasksByUser: (userId, projectId) => `/tasks?populate=*`,};

export default taskEndpoints;
