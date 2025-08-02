import React, { useState } from 'react';
import { createComment } from '../../api/comment';

function CommentForm({ postId, token, onCommentCreated }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = await createComment(postId, content, token);
      onCommentCreated(newComment);
      setContent('');
    } catch (error) {
      alert(`댓글 작성 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        required
      />
      <button type="submit">댓글 작성</button>
    </form>
  );
}

export default CommentForm;
