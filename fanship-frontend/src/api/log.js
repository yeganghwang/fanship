import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/logins';

/**
 * 7.1. 로그인 시 기록 저장
 * @param {object} logData - { user_id, ip_address, user_agent }
 * @param {string} token - JWT 토큰
 * @returns {Promise<object>} 생성된 로그 정보
 */
export const recordLogin = async (logData, token) => {
  try {
    const response = await axios.post(API_URL, logData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
