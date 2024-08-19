const userEndpoints = {
  getUsers: '/users',
  getUserById: id => `/users/${id}`,
  createUser: '/users',
  updateUser: id => `/users/${id}`,
  deleteUser: id => `/users/${id}`,
};

export default userEndpoints;
