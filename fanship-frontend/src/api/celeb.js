import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/celebs';

export const getCelebDetail = async (celebId) => {
  try {
    const response = await axios.get(`${API_URL}/${celebId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
