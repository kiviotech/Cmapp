// submissionRepository.js

import apiClient from "../apiClient";
import submissionEndpoints from "../endpoints/submissionEndpoints";

export const getSubmissions = () =>
  apiClient.get(submissionEndpoints.getSubmissions);

export const getSubmissionById = (id) =>
  apiClient.get(submissionEndpoints.getSubmissionById(id));

export const createSubmission = (data) =>
  apiClient.post(submissionEndpoints.createSubmission, data);

export const updateSubmission = (id, data) =>
  apiClient.put(submissionEndpoints.updateSubmission(id), data);

export const deleteSubmission = (id) =>
  apiClient.delete(submissionEndpoints.deleteSubmission(id));
