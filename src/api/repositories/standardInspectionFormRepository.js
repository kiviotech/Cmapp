import apiClient from "../apiClient";
import standardInspectionFormEndpoints from "../endpoints/standardInspectionFormEndpoints";

export const getStandardInspectionForms = () =>
  apiClient.get(standardInspectionFormEndpoints.getStandardInspectionForms);

export const getStandardInspectionFormById = (id) =>
  apiClient.get(
    standardInspectionFormEndpoints.getStandardInspectionFormById(id)
  );

export const createStandardInspectionForm = (data) =>
  apiClient.post(
    standardInspectionFormEndpoints.createStandardInspectionForm,
    data
  );

export const updateStandardInspectionForm = (id, data) =>
  apiClient.put(
    standardInspectionFormEndpoints.updateStandardInspectionForm(id),
    data
  );

export const deleteStandardInspectionForm = (id) =>
  apiClient.delete(
    standardInspectionFormEndpoints.deleteStandardInspectionForm(id)
  );
