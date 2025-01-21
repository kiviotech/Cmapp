const taskEndpoints = {
  getTasks: (
    userId,
    page,
    pageSize,
    designation_value = "project_team_member"
  ) =>
    `/tasks?filters[${designation_value}][id][$eq]=${userId}&populate[standard_task][populate]=image&populate[documents]=true&populate[submissions][populate]=proofOfWork&populate[project]=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}
`,

  getProjectAndDocumentByUserId: (
    userId,
    page,
    pageSize,
    designation_value = "contractor"
  ) =>
    `/tasks?filters[${designation_value}][id][$eq]=${userId}&populate[documents]=true&populate[submissions][populate]=proofOfWork&populate[project]=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,

  getContractorTasks: (userId, page, pageSize) =>
    `/tasks?filters[contractor][id][$eq]=${userId}&populate[standard_task]=*&populate[documents]=true&populate[submissions][populate]=proofOfWork&populate[project]=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,

  getTaskByProjectIdAndUserId: (projectId) =>
    `/tasks?filters[project][id][$eq]=${projectId}&populate=*`,

  getTaskById: (id) => `/tasks/${id}?populate=*`,
  getTaskDetailsById: (id) =>
    `/tasks?populate[0]=assigned_to&populate[1]=project&filters[assigned_to][id][$eq]=${id}`,
  createTask: "/tasks",
  updateTask: (id) => `/tasks/${id}`,
  deleteTask: (id) => `/tasks/${id}`,
  getTasksByUserAndProject: (userId, projectId) =>
    `/tasks?filters[assigned_to][$eq]=${userId}&filters[project][$eq]=${projectId}&populate=*`,

  getTasksByUser: (userId) =>
    `/tasks?filters[assigned_to][id][$eq]=${userId}&populate=*`,
  getTaskByContractorId: (projectId, id) =>
    `/tasks?filters[project][id][$eq]=${projectId}&filters[project_team_member][id][$eq]=${id}&populate=*`,
  getTasksBySubmissionId: (id) =>
    `/tasks?populate=*&filters[submissions][id][$eq]=${id}`,
};

export default taskEndpoints;
