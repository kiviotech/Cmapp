const subContractorEndpoints = {
  getSubContractors: `sub-contractors?populate=*`,
  getSubContractorById: (id) => `/sub-contractors/${id}`,
  createSubContractor: "/sub-contractors",
  updateSubContractor: (id) => `/sub-contractors/${id}`,
  deleteSubContractor: (id) => `/sub-contractors/${id}`,
};

export default subContractorEndpoints;
