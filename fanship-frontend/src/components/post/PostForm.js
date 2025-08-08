import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { uploadImage } from '../../api/upload';

function PostForm({ onSubmit, initialData = {}, isEdit = false, token }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notice, setNotice] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | success | error
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setNotice(initialData.notice || false);
    }
  }, [isEdit, initialData]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('uploading');
    setUploadError('');

    try {
      const imageUrl = await uploadImage(file, token);
      // 이미지 URL을 마크다운/HTML 형식으로 본문에 추가
      const imageMarkdown = `\n<img src="${imageUrl}" alt="uploaded image" style="max-width: 100%;"/>\n`;
      setContent((prevContent) => prevContent + imageMarkdown);
      setUploadStatus('success');
    } catch (err) {
      setUploadStatus('error');
      setUploadError('이미지 업로드 실패: ' + (err.response?.data?.message || err.message));
    } finally {
      // 파일 입력 초기화
      e.target.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, notice });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formPostTitle">
        <Form.Label>제목</Form.Label>
        <Form.Control
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPostContent">
        <Form.Label>내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPostImage">
        <Form.Label>이미지 첨부</Form.Label>
        <Form.Control 
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploadStatus === 'uploading'}
        />
        {uploadStatus === 'uploading' && (
          <div className="mt-2"><Spinner animation="border" size="sm" /> 이미지 업로드 중...</div>
        )}
        {uploadStatus === 'success' && (
          <Alert variant="success" className="mt-2">이미지가 본문에 추가되었습니다.</Alert>
        )}
        {uploadStatus === 'error' && (
          <Alert variant="danger" className="mt-2">{uploadError}</Alert>
        )}
      </Form.Group>

      <Form.Group className="mb-3" id="formPostNotice">
        <Form.Check 
          type="checkbox" 
          label="공지사항으로 등록"
          checked={notice}
          onChange={(e) => setNotice(e.target.checked)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={uploadStatus === 'uploading'}>
        {isEdit ? '글 수정' : '글 작성'}
      </Button>
    </Form>
  );
}

export default PostForm;