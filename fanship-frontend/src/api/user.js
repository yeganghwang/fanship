import api from './axiosInstance';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/users';

export const getUserProfile = async (userId, token) => {
  try {
    const response = await api.get(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserProfile = async (userId, userData, token) => {
  try {
    const response = await api.patch(`${API_URL}/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
