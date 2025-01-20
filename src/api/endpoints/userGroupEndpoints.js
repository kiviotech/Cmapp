const userGroupEndpoints = {
  getUserGroupsWithContractorRole: `user-groups?populate=*&filters[designation][Name][$eq]=Contractor`,
  getUserGroupById: (id) => `/user-groups/${id}?populate=*`,
  createUserGroup: "/user-groups",
  updateUserGroup: (id) => `/user-groups/${id}`,
  deleteUserGroup: (id) => `/user-groups/${id}`,
};

export default userGroupEndpoints;
