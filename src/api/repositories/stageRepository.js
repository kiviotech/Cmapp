import apiClient from '../apiClient';
import stageEndpoints from '../endpoints/stageEndpoints';

export const getStages = () => apiClient.get(stageEndpoints.getStages);

export const getStageById = id => apiClient.get(stageEndpoints.getStageById(id));

export const createStage = data => apiClient.post(stageEndpoints.createStage, data);

export const updateStage = (id, data) => apiClient.put(stageEndpoints.updateStage(id), data);

export const deleteStage = id => apiClient.delete(stageEndpoints.deleteStage(id));
