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

export const signup = async (name, email, password, socialSecurity, contractorLicense, projectId) => {
  try {

    
    const response = await apiClient.post("/registrations", {
      data: {
        fullName: name,
        email: email,
        password: password,
        socialSecurityNumber: socialSecurity,
        project: projectId,
        approver: '',
        documents: [],
        // documents: contractorLicense[0].uri,
        // documents: contractorLicense,
        status: 'pending',
        password: password,

      }
      // {
  // "data": {
  //   "fullName": "string",
  //   "socialSecurityNumber": "123456789",
  //   "email": "user@example.com",
  //   "project": "string or id",
  //   "documents": [
  //     "string or id",
  //     "string or id"
  //   ],
  //   "approver": "string or id",
  //   "status": "approved",
  //   "password": "string"
  // }
      
      
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