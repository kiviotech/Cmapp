import apiClient from '../apiClient';
import subcategoryEndpoints from '../endpoints/subcategoryEndpoints';

export const getSubcategories = () => apiClient.get(subcategoryEndpoints.getSubcategories);

export const getSubcategoryById = id => apiClient.get(subcategoryEndpoints.getSubcategoryById(id));

export const createSubcategory = data => apiClient.post(subcategoryEndpoints.createSubcategory, data);

export const updateSubcategory = (id, data) => apiClient.put(subcategoryEndpoints.updateSubcategory(id), data);

export const deleteSubcategory = id => apiClient.delete(subcategoryEndpoints.deleteSubcategory(id));
