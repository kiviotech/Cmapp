const inspectionSectionEndpoints = {
  getInspectionSections: "/inspection-sections",
  getInspectionSectionById: (id) => `/inspection-sections/${id}`,
  createInspectionSection: "/inspection-sections",
  updateInspectionSection: (id) => `/inspection-sections/${id}`,
  deleteInspectionSection: (id) => `/inspection-sections/${id}`,
};

export default inspectionSectionEndpoints;
