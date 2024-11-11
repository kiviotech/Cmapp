const submissionEndpoints = {
  // getSubmissions: "/submissions?populate=task.User,proofOfWork",
  // getSubmissions: `/submissions?populate[task][populate]=*`,
  getSubmissions: `submissions?populate[task][populate]=*&populate[proofOfWork]=*&populate=*`,
  getSubmissionById: (id) => `/submissions/${id}?populate=*`,
  createSubmission: "/submissions",
  updateSubmission: (id) => `/submissions/${id}`,
  deleteSubmission: (id) => `/submissions/${id}`,
};

export default submissionEndpoints;
