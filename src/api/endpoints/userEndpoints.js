const userEndpoints = {
  getUsers: "/users?populate=*",
  getUserById: (id) => `/users/${id}?populate[tasks][populate]=*`,
  createUser: "/auth/local/register",
  loginUser: "/auth/local",
  updateUser: (id) => `/users/${id}`,
  deleteUser: (id) => `/users/${id}`,
  getAuthenticatedUser: "/users/me",
  getAuthenticatedUserWithPopulate: (fields) => `/users/me?populate=${fields}`,
  resetPassword: "/auth/reset-password",
  forgotPassword: "/auth/forgot-password",
  changePassowrd: "/auth/change-password",
  updateUserRole: (id) => `/users/${id}/roles`,
  getRoles: "/users-permissions/roles",
  getRoleById: (id) => `/users-permissions/roles/${id}`,
  getRegistrationByEmail: (email) =>
    `/registrations?filters[email][$eq]=${email}&populate=*`,
  getProjectByUserId: (id) => `/users/${id}?populate[project][populate][tasks][populate]=*`, 
  getTaskByUserId: (id)=> `/users/${id}?populate[project][populate][tasks][populate][standard_task][populate][subcategory][populate][category][populate]=stage`
};

export default userEndpoints;
