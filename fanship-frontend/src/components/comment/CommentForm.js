import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { createComment } from '../../api/comment';

function CommentForm({ postId, token, onCommentCreated }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const newComment = await createComment(postId, content, token);
      onCommentCreated(newComment);
      setContent('');
    } catch (error) {
      alert(`댓글 작성 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4">
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          required
        />
      </Form.Group>
      <div className="text-end">
        <Button variant="primary" type="submit" disabled={!content.trim()}>
          댓글 작성
        </Button>
      </div>
    </Form>
  );
}

export default CommentForm;
