const standardInspectionFormEndpoints = {
  getStandardInspectionForms: "/standard-inspection-forms",
  getStandardInspectionFormById: (id) => `/standard-inspection-forms/${id}`,
  createStandardInspectionForm: "/standard-inspection-forms",
  updateStandardInspectionForm: (id) => `/standard-inspection-forms/${id}`,
  deleteStandardInspectionForm: (id) => `/standard-inspection-forms/${id}`,
};

export default standardInspectionFormEndpoints;
