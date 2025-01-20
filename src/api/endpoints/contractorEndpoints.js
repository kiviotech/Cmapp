const contractorEndpoints = {
  getContractors: "/contractors?populate=*",
  getContractorById: (id) => `/contractors/${id}`,
  getContractorsByUserId: (userId) =>
    `/contractors?filters[user][id][$eq]=${userId}&populate=*`,
  getContractorsIdByUserId: (userId) =>
    `/contractors?filters[user][id][$eq]=${userId}`,
  createContractor: "/contractors",
  updateContractor: (id) => `/contractors/${id}`,
  deleteContractor: (id) => `/contractors/${id}`,
};

export default contractorEndpoints;
