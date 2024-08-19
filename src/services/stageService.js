import { getStages, getStageById, createStage, updateStage, deleteStage } from '../api/repositories/stageRepository';

export const fetchStages = async () => {
  try {
    const response = await getStages();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchStageById = async id => {
  try {
    const response = await getStageById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
