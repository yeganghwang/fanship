import api from './axiosInstance';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// 5.1. 셀럽 스케줄 등록
export const createSchedule = async (celebId, scheduleData, token) => {
  try {
    const response = await api.post(`${API_URL}/celebs/${celebId}/schedules`, scheduleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 5.2. 셀럽 스케줄 조회
export const getSchedules = async (celebId, params) => {
  try {
    const response = await api.get(`${API_URL}/celebs/${celebId}/schedules`, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 5.3. 셀럽 스케줄 삭제
export const deleteSchedule = async (scheduleId, token) => {
  try {
    const response = await api.delete(`${API_URL}/celebs/schedules/${scheduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};