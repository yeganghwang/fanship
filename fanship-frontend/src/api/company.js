import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/companies';

export const createCompany = async (companyData, token) => {
  try {
    const response = await axios.post(API_URL, companyData, {
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
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCelebsByCompanyId = async (companyId, params) => {
  try {
    const response = await axios.get(`${API_URL}/${companyId}/celebs`, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
