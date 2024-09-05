import apiClient from '../api/apiClient';
import { deleteToken, saveToken , saveUserId} from './storage';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
    });

    // Extract JWT and user data from the response
    const { jwt, user, id } = response.data;

    console.log("auth.js", jwt, response.data);
    // Save the JWT to secure storage
    saveToken(jwt);
    saveUserId(user.id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (name, email, password, socialSecurity, contractorLicense) => {
  try {
    const response = await apiClient.post("/sign-ups", {
      data: {
        fullName: name,
        email: email,
        password: password,
        socialSecurity: socialSecurity,
        projectSelection: '',
        contractorLicense: contractorLicense[0].uri,
        approver: '',
        project: ''
      }

    });
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;

  }
};

export const logout = (jwt) => {
  deleteToken(jwt);
};