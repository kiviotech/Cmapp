const submissionEndpoints = {
  // getSubmissions: "/submissions?populate=task.User,proofOfWork",
  // getSubmissions: `/submissions?populate[task][populate]=*`,
  getSubmissions: `submissions?populate[task][populate]=*&populate[proofOfWork]=*&populate[submitted_by]=*populate=*`,
  getSubmissionsByUserId: (userId) => `/submissions?filters[submitted_by][id][$eq]=${userId}&populate[task][populate]=*&populate=*`,
  getSubmissionById: (id) => `/submissions/${id}?populate=*`,
  createSubmission: "/submissions",
  updateSubmission: (id) => `/submissions/${id}`,
  deleteSubmission: (id) => `/submissions/${id}`,
};

export default submissionEndpoints;
