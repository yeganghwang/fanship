import api from './axiosInstance';
import { logout } from './auth'; // 로그아웃 함수 import

const API_URL = process.env.REACT_APP_API_BASE_URL;

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      logout(); // 자동 로그아웃
      window.location.href = '/login'; // 로그인 페이지로 이동
    }
    return Promise.reject(error);
  }
);

// 4.6. 댓글 작성
export const createComment = async (postId, content, token) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content }, {
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
  const response = await api.get(`/posts/${postId}/comments`, { params });
  return response.data;
};

// 4.8. 댓글 수정
export const updateComment = async (commentId, content, token) => {
  try {
    const response = await api.patch(`/comments/${commentId}`, { content }, {
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
    const response = await api.delete(`/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
