const standardTaskEndpoints = {
  getStandardTasks: `/standard-tasks?populate=*`,
  getStandardTasksBySubcontractor: (subcontractor) => `/standard-tasks?populate=*&filters[sub_contractor][name]=${subcontractor}`,
  getStandardTasksByProjectTeam: (projectTeam) => `/standard-tasks?populate=*&filters[project_team][job_role]=${projectTeam}`,
  getStandardTaskById: (id) => `/standard-tasks/${id}?populate=*`,
  createStandardTask: "/standard-tasks",
  updateStandardTask: (id) => `/standard-tasks/${id}`,
  deleteStandardTask: (id) => `/standard-tasks/${id}`,
};

export default standardTaskEndpoints;
