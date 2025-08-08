import api from './axiosInstance';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// 3.1. 즐겨찾기 추가
export const addFavorite = async (favoriteData, token) => {
  try {
    const response = await api.post(`${API_URL}/favorites`, favoriteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 3.2. 즐겨찾기 삭제
export const removeFavorite = async (favoriteId, token) => {
  try {
    const response = await api.delete(`${API_URL}/favorites/${favoriteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 3.3. 사용자의 즐겨찾기 목록 조회
export const getFavorites = async (userId, token, params) => {
  try {
    const response = await api.get(`${API_URL}/users/${userId}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
