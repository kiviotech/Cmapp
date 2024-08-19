import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../api/repositories/userRepository';

export const fetchUsers = async () => {
  try {
    const response = await getUsers();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserById = async id => {
  try {
    const response = await getUserById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
