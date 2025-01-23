const projectInspectionEndpoints = {
  getProjectInspections: "/project-inspections",
  getProjectInspectionById: (id) => `/project-inspections/${id}`,
  createProjectInspection: "/project-inspections",
  updateProjectInspection: (id) => `/project-inspections/${id}`,
  deleteProjectInspection: (id) => `/project-inspections/${id}`,
  getProjectInspectionsByProjectId: (projectId) =>
    `/project-inspections?populate[0]=project&populate[1]=standard_inspection_form.inspection_sections.checklist_items.inspection_response&filters[project][id]=${projectId}`,
};

export default projectInspectionEndpoints;
