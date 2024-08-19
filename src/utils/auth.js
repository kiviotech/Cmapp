import apiClient from '../api/apiClient';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/local', {
      identifier: email,
      password: password,
    });

    localStorage.setItem('authToken', response.data.jwt);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
};
