import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// 4.1. 게시글 작성
export const createPost = async (postData, token) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 4.2. 게시글 목록 조회
export const getPosts = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/posts`, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 3.4. 사용자가 작성한 게시글 목록 조회
export const getPostsByUserId = async (userId, params) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/posts`, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 4.3. 게시글 상세 조회
export const getPost = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 4.4. 게시글 수정
export const updatePost = async (postId, postData, token) => {
  try {
    const response = await axios.patch(`${API_URL}/posts/${postId}`, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 4.5. 게시글 삭제
export const deletePost = async (postId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};