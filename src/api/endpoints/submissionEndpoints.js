const submissionEndpoints = {
    getSubmissions: '/submissions?populate=*',
    getSubmissionById: id => `/submissions/${id}?populate=*`,
    createSubmission: '/submissions',
    updateSubmission: id => `/submissions/${id}`,
    deleteSubmission: id => `/submissions/${id}`,
  };
  
  export default submissionEndpoints;