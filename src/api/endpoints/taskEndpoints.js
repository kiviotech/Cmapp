const taskEndpoints = {
  getTasks: '/tasks?populate=*',
  getTaskById: id => `/tasks/${id}?populate=*`,
  createTask: '/tasks',
  updateTask: id => `/tasks/${id}`,
  deleteTask: id => `/tasks/${id}`,
};

export default taskEndpoints;
