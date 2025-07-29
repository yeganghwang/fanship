import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/auth'; // .env 파일에서 환경 변수 사용

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const passwordResetRequest = async (mail) => {
  try {
    const response = await axios.post(`${API_URL}/password-reset-request`, { mail });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const passwordResetConfirm = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/password-reset-confirm`, { token, new_password: newPassword });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const changePassword = async (currentPassword, newPassword, token) => {
  try {
    const response = await axios.post(`${API_URL}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};