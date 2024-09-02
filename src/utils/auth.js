import apiClient from '../api/apiClient';
import { deleteToken, saveToken } from './storage';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
    });

    // Extract JWT and user data from the response
    const { jwt, user } = response.data;

    console.log("auth.js", jwt);
    // Save the JWT to secure storage
    saveToken(jwt);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = (jwt) => {
  deleteToken(jwt);
};

export const SignUp = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};