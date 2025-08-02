import React, { useState, useEffect } from 'react';

function GoodsForm({ onSubmit, initialData = {} }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [price, setPrice] = useState(initialData.price || 0);
  const [amount, setAmount] = useState(initialData.amount || 0);
  const [notice, setNotice] = useState(initialData.notice || false);

  useEffect(() => {
    setTitle(initialData.title || '');
    setContent(initialData.content || '');
    setPrice(initialData.price || 0);
    setAmount(initialData.amount || 0);
    setNotice(initialData.notice || false);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, price, amount, notice });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>상품명:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>설명:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>가격:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>수량:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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
          공지
        </label>
      </div>
      <button type="submit">저장</button>
    </form>
  );
}

export default GoodsForm;
