const standardTaskEndpoints = {
  getStandardTasks: `/standard-tasks?populate=*`,
  getStandardTaskById: (id) => `/standard-tasks/${id}`,
  createStandardTask: "/standard-tasks",
  updateStandardTask: (id) => `/standard-tasks/${id}`,
  deleteStandardTask: (id) => `/standard-tasks/${id}`,
};

export default standardTaskEndpoints;
