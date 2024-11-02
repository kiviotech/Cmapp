const subcategoryEndpoints = {
  getSubcategories: `subcategories?populate=*`,
  getSubcategoryById: (id) => `/subcategories/${id}`,
  createSubcategory: "/subcategories",
  updateSubcategory: (id) => `/subcategories/${id}`,
  deleteSubcategory: (id) => `/subcategories/${id}`,
};

export default subcategoryEndpoints;
