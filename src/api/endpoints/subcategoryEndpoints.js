const subcategoryEndpoints = {
  getSubcategories: '/subcategories',
  getSubcategoryById: id => `/subcategories/${id}`,
  createSubcategory: '/subcategories',
  updateSubcategory: id => `/subcategories/${id}`,
  deleteSubcategory: id => `/subcategories/${id}`,
};

export default subcategoryEndpoints;
