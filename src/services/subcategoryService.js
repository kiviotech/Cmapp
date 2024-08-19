import { getSubcategories, getSubcategoryById, createSubcategory, updateSubcategory, deleteSubcategory } from '../api/repositories/subcategoryRepository';

export const fetchSubcategories = async () => {
  try {
    const response = await getSubcategories();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubcategoryById = async id => {
  try {
    const response = await getSubcategoryById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
