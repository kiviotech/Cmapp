const categoryEndpoints = {
  getCategories: '/categories',
  getCategoryById: id => `/categories/${id}`,
  createCategory: '/categories',
  updateCategory: id => `/categories/${id}`,
  deleteCategory: id => `/categories/${id}`,
};

export default categoryEndpoints;
