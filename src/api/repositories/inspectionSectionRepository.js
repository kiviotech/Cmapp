import apiClient from "../apiClient";
import inspectionSectionEndpoints from "../endpoints/inspectionSectionEndpoints";

export const getInspectionSections = () =>
  apiClient.get(inspectionSectionEndpoints.getInspectionSections);

export const getInspectionSectionById = (id) =>
  apiClient.get(inspectionSectionEndpoints.getInspectionSectionById(id));

export const createInspectionSection = (data) =>
  apiClient.post(inspectionSectionEndpoints.createInspectionSection, data);

export const updateInspectionSection = (id, data) =>
  apiClient.put(inspectionSectionEndpoints.updateInspectionSection(id), data);
