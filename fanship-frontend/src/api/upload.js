import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/uploads';
const IMAGE_FILE_URL = process.env.REACT_APP_SERVER_URL; // .env에 정의된 서버 주소

/**
 * 이미지 파일을 서버에 업로드하고 업로드된 이미지 URL을 반환합니다.
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} [token] - JWT 토큰(옵션)
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
export async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await axios.post(API_URL, formData, { headers });
  if (response.data && response.data.url) {
    return IMAGE_FILE_URL + response.data.url; // 예: http://192.168.123.5:3000/uploads/파일명
  } else {
    throw new Error('이미지 업로드 실패: 서버 응답 오류');
  }
}
