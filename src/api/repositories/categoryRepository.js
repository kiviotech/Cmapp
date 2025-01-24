import apiClient from "../apiClient";
import categoryEndpoints from "../endpoints/getCategoryEndPoints";

export const getCategories = () =>
  apiClient.get(categoryEndpoints.getCategories);

export const getCategoryById = (id) =>
  apiClient.get(categoryEndpoints.getCategoryById(id));

export const createCategory = (data) =>
  apiClient.post(categoryEndpoints.createCategory, data);

export const updateCategory = (id, data) =>
  apiClient.put(categoryEndpoints.updateCategory(id), data);

export const deleteCategory = (id) =>
  apiClient.delete(categoryEndpoints.deleteCategory(id));
