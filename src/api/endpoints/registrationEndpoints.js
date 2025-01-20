const registrationEndpoints = {
  getRegistrations: "/registrations?populate=*",
  getRegistrationById: (id) => `/registrations/${id}?populate=*`,
  createRegistration: "/registrations",
  updateRegistration: (id) => `/registrations/${id}`,
  deleteRegistration: (id) => `/registrations/${id}`,
};

export default registrationEndpoints;
