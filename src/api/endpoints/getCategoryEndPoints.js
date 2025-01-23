export const categoryEndpoints = {
    getCategories: "/categories",
    getCategoryById: (id) => `/categories/${id}?populate=subcategories`,


};