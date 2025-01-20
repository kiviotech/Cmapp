const contractorEndpoints = {
  getContractors: "/contractors",
  getContractorById: (id) => `/contractors/${id}`,
  getContractorsByUserId: (userId) =>
    `/contractors?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
  createContractor: "/contractors",
  updateContractor: (id) => `/contractors/${id}`,
  deleteContractor: (id) => `/contractors/${id}`,
};

export default contractorEndpoints;
