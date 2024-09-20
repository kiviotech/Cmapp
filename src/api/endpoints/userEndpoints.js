const userEndpoints = {
  getUsers: '/users',
  getUserById: id => `/users/${id}`,
  createUser: '/auth/local/register',
  updateUser: id => `/users/${id}`,
  deleteUser: id => `/users/${id}`,
};

export default userEndpoints;
