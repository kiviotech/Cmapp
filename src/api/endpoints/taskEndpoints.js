const taskEndpoints = {
  getTasks: '/tasks',
  getTaskById: id => `/tasks/${id}`,
  createTask: '/tasks',
  updateTask: id => `/tasks/${id}`,
  deleteTask: id => `/tasks/${id}`,
};

export default taskEndpoints;
