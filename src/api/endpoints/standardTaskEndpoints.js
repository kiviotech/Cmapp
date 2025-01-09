const standardTaskEndpoints = {
  getStandardTasks: `/standard-tasks?populate=*`,
  getStandardTasksBySubcontractor: (subcontractor) => `/standard-tasks?populate=*&filters[sub_contractor][$ne]=${subcontractor}`,
  getStandardTaskById: (id) => `/standard-tasks/${id}?populate=*`,
  createStandardTask: "/standard-tasks",
  updateStandardTask: (id) => `/standard-tasks/${id}`,
  deleteStandardTask: (id) => `/standard-tasks/${id}`,
};

export default standardTaskEndpoints;
