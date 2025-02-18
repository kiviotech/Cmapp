const projectInspectionEndpoints = {
  getProjectInspections: "/project-inspections",
  getProjectInspectionById: (id) => `/project-inspections/${id}`,
  createProjectInspection: "/project-inspections",
  updateProjectInspection: (id) => `/project-inspections/${id}`,
  deleteProjectInspection: (id) => `/project-inspections/${id}`,
  getProjectInspectionsByProjectId: (projectId, subcategory) =>
    `/project-inspections?populate[0]=project&populate[1]=inspection_responses.checklist_item&populate[2]=standard_inspection_form.inspection_sections.checklist_items&filters[project][id]=${projectId}&filters[standard_inspection_form][subcategory][name]=${subcategory}`,
};

export default projectInspectionEndpoints;
