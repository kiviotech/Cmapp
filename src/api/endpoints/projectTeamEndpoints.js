const projectTeamEndpoints = {
  getProjectTeams: "/project-teams",

  getProjectTeamById: (id) => `/project-teams/${id}?populate=*`,

  getProjectTeamIdByUserId: (userId) =>
    `/project-teams?filters[users][id][$eq]=${userId}&fields[0]=id`,

  getProjectTeamManager: (designation) =>
    `/project-teams?populate[users][populate][user_group][populate][designation]=*&populate[projects][populate]=*&filters[users][user_group][designation][Name][$eq]=${designation}`,

  createProjectTeam: "/project-teams",

  updateProjectTeam: (id) => `/project-teams/${id}`,

  deleteProjectTeam: (id) => `/project-teams/${id}`,
};

export default projectTeamEndpoints;
