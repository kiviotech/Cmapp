const stageEndpoints = {
  getStages: '/stages',
  getStageById: id => `/stages/${id}`,
  createStage: '/stages',
  updateStage: id => `/stages/${id}`,
  deleteStage: id => `/stages/${id}`,
};

export default stageEndpoints;
