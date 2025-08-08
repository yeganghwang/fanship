import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { uploadImage } from '../../api/upload';

function GoodsForm({ onSubmit, initialData = {}, isEdit = false, token }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [notice, setNotice] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setPrice(initialData.price || 0);
      setAmount(initialData.amount || 0);
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
      const imageMarkdown = `\n<img src="${imageUrl}" alt="uploaded image" style="max-width: 100%;"/>\n`;
      setContent((prevContent) => prevContent + imageMarkdown);
      setUploadStatus('success');
    } catch (err) {
      setUploadStatus('error');
      setUploadError('이미지 업로드 실패: ' + (err.response?.data?.message || err.message));
    } finally {
      e.target.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, price, amount, notice });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formGoodsTitle">
        <Form.Label>상품명</Form.Label>
        <Form.Control
          type="text"
          placeholder="상품명을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGoodsContent">
        <Form.Label>설명</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="상품에 대한 상세 설명을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGoodsImage">
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

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formGoodsPrice">
            <Form.Label>가격 (원)</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              min="0"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formGoodsAmount">
            <Form.Label>수량</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              min="0"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" id="formGridCheckbox">
        <Form.Check 
          type="checkbox" 
          label="공지사항으로 등록"
          checked={notice}
          onChange={(e) => setNotice(e.target.checked)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={uploadStatus === 'uploading'}>
        {isEdit ? '굿즈 수정' : '굿즈 등록'}
      </Button>
    </Form>
  );
}

export default GoodsForm;