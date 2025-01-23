import apiClient from "../apiClient";
import inspectionFormEndpoints from "../endpoints/inspectionResponseEndPoints";

export const getInspectionForms = () =>
  apiClient.get(inspectionFormEndpoints.getInspectionForms);

export const getInspectionFormById = (id) =>
  apiClient.get(inspectionFormEndpoints.getInspectionFormById(id));

export const createInspectionForm = (data) =>
  apiClient.post(inspectionFormEndpoints.createInspectionForm, data);

export const updateInspectionForm = (id, data) =>
  apiClient.put(inspectionFormEndpoints.updateInspectionForm(id), data);

export const deleteInspectionForm = (id) =>
  apiClient.delete(inspectionFormEndpoints.deleteInspectionForm(id));
