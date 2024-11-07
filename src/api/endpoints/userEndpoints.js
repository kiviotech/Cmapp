const userEndpoints = {
  getUsers: "/users?populate=*",
  getUserById: (id) => `/users/${id}?populate=*`,
  createUser: "/auth/local/register",
  loginUser: "/auth/local",
  updateUser: (id) => `/users/${id}`,
  deleteUser: (id) => `/users/${id}`,
  getAuthenticatedUser: "/users/me",
  getAuthenticatedUserWithPopulate: (fields) => `/users/me?populate=${fields}`,
  resetPassword: "/auth/reset-password",
  forgotPassword: "/auth/forgot-password",
  updateUserRole: (id) => `/users/${id}/roles`,
  getRoles: "/users-permissions/roles",
  getRoleById: (id) => `/users-permissions/roles/${id}`,
};

export default userEndpoints;
