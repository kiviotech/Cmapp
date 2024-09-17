const submissionEndpoints = {
  getSubmissions: "/submissions?populate=task.User,proofOfWork",
  getSubmissionById: (id) => `/submissions/${id}?populate=*`,
  createSubmission: "/submissions",
  updateSubmission: (id) => `/submissions/${id}`,
  deleteSubmission: (id) => `/submissions/${id}`,
};
  
  export default submissionEndpoints;