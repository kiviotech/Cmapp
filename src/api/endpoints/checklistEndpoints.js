const checklistEndpoints = {
  getChecklistItems: "/checklist-items",
  getChecklistItemById: (id) => `/checklist-items/${id}`,
  createChecklistItem: "/checklist-items",
  updateChecklistItem: (id) => `/checklist-items/${id}`,
  deleteChecklistItem: (id) => `/checklist-items/${id}`,
};

export default checklistEndpoints;
