import api from './axiosInstance';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/goods';

// 6.1. 굿즈 등록
export const createGoods = async (goodsData, token) => {
  try {
    const response = await api.post(API_URL, goodsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 6.2. 굿즈 목록 조회
export const getGoodsList = async (params) => {
  try {
    const response = await api.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 6.3. 굿즈 상세 조회
export const getGoods = async (goodsId) => {
  try {
    const response = await api.get(`${API_URL}/${goodsId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 6.4. 굿즈 수정
export const updateGoods = async (goodsId, goodsData, token) => {
  try {
    const response = await api.patch(`${API_URL}/${goodsId}`, goodsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 6.5. 굿즈 삭제
export const deleteGoods = async (goodsId, token) => {
  try {
    const response = await api.delete(`${API_URL}/${goodsId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 6.6. 특정 사용자가 등록한 굿즈 목록 조회
export const getGoodsByUserId = async (userId, params) => {
  try {
    const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}/goods`, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
