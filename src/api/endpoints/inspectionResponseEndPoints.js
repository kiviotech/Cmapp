const inspectionFormEndpoints = {
  getInspectionForms: "/inspection-responses",
  getInspectionFormById: (id) => `/inspection-responses/${id}`,
  createInspectionForm: "/inspection-responses",
  updateInspectionForm: (id) => `/inspection-responses/${id}`,
  deleteInspectionForm: (id) => `/inspection-responses/${id}`,
};

export default inspectionFormEndpoints;
