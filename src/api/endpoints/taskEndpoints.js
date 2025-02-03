const taskEndpoints = {
  getTasks: (
    userId,
    page,
    pageSize,
    designation_value = "project_team_member"
  ) =>
    `/tasks?filters[${designation_value}][id][$eq]=${userId}&populate[standard_task][populate]=image&populate[project]=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,

  getProjectAndDocumentByUserId: (userId, designation_value = "contractor") =>
    `/tasks?filters[${designation_value}][id][$eq]=${userId}&populate[standard_task]=*&populate[documents]=true&populate[submissions][populate]=proofOfWork&populate[project]=*`,

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
  getTaskByContractorId: (projectId, userId) =>
    `/tasks?filters[project][id][$eq]=${projectId}&filters[contractor][user][id][$eq]=${userId}&populate=*`,
  getTasksBySubmissionId: (id) =>
    `/tasks?populate=*&filters[submissions][id][$eq]=${id}`,
  getTasksByProjectNameAndStatus: (
    userId,
    standard_task,
    standard_task_data,
    projectName = "true",
    projectData,
    status = "true",
    statusData,
    page,
    pageSize,
    designation_value = "project_team_member"
  ) =>
    `/tasks?filters[standard_task][Name][$${standard_task_data}]=${standard_task}&filters[${designation_value}][id][$eq]=${userId}&populate[standard_task][populate]=image&populate[project]=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[task_status][$${statusData}]=${status}&filters[project][name][$${projectData}]=${projectName}`,
};

export default taskEndpoints;
