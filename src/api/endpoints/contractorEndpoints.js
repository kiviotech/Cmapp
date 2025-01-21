const contractorEndpoints = {
  getContractors: "/contractors?populate=*",
  getContractorById: (id) => `/contractors/${id}`,
  getContractorsByUserId: (userId) =>
    `/contractors?filters[user][id][$eq]=${userId}&populate=*`,
  getContractorsIdByUserId: (userId) =>
    `/contractors?filters[user][id][$eq]=${userId}&populate[projects]=*`,
  getContractorsWithSubContractor: (userId) =>
    `/contractors?filters[user][id][$eq]=${userId}&populate[sub_contractor][populate]`,
  createContractor: "/contractors",
  updateContractor: (id) => `/contractors/${id}`,
  deleteContractor: (id) => `/contractors/${id}`,
};

export default contractorEndpoints;
