import React, { useState, useEffect } from 'react';

function PostForm({ onSubmit, initialData }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setNotice(initialData.notice || false);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, notice });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>제목:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>내용:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notice}
            onChange={(e) => setNotice(e.target.checked)}
          />
          공지사항
        </label>
      </div>
      <button type="submit">저장</button>
    </form>
  );
}

export default PostForm;