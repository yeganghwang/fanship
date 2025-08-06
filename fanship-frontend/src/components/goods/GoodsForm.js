import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

function GoodsForm({ onSubmit, initialData = {}, isEdit = false }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    setTitle(initialData.title || '');
    setContent(initialData.content || '');
    setPrice(initialData.price || 0);
    setAmount(initialData.amount || 0);
    setNotice(initialData.notice || false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 변경: 최초 마운트 시에만 실행

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

      <Button variant="primary" type="submit">
        {isEdit ? '굿즈 수정' : '굿즈 등록'}
      </Button>
    </Form>
  );
}

export default GoodsForm;
