import api from './axiosInstance';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/companies';

export const createCompany = async (companyData, token) => {
  try {
    const response = await api.post(API_URL, companyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCompanyList = async (params) => {
  try {
    const response = await api.get(API_URL, { params });
    const sortedList = response.data.list.sort((a, b) => a.company_name.localeCompare(b.company_name, 'ko'));
    return { ...response.data, list: sortedList };
  } catch (error) {
    throw error.response.data;
  }
};

export const getCelebsByCompanyId = async (companyId, params) => {
  try {
    const response = await api.get(`${API_URL}/${companyId}/celebs`, { params });
    // 셀럽 리스트를 닉네임 기준 오름차순 정렬
    const sortedList = response.data.list.sort((a, b) => a.nickname.localeCompare(b.nickname, 'ko'));
    return { ...response.data, list: sortedList };
  } catch (error) {
    throw error.response.data;
  }
};
