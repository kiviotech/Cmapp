import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../api/repositories/categoryRepository';

export const fetchCategories = async () => {
  try {
    const response = await getCategories();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryById = async id => {
  try {
    const response = await getCategoryById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
