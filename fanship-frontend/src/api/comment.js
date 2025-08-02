import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// 4.6. 댓글 작성
export const createComment = async (postId, content, token) => {
  try {
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 4.7. 댓글 목록 조회
export const getComments = async (postId, params) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 4.8. 댓글 수정
export const updateComment = async (commentId, content, token) => {
  try {
    const response = await axios.patch(`${API_URL}/comments/${commentId}`, { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 4.9. 댓글 삭제
export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
