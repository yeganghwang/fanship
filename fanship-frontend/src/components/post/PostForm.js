import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function PostForm({ onSubmit, initialData = {}, isEdit = false }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setNotice(initialData.notice || false);
    }
  }, [isEdit, initialData]);

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

      <Form.Group className="mb-3" id="formPostNotice">
        <Form.Check 
          type="checkbox" 
          label="공지사항으로 등록"
          checked={notice}
          onChange={(e) => setNotice(e.target.checked)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        {isEdit ? '글 수정' : '글 작성'}
      </Button>
    </Form>
  );
}

export default PostForm;