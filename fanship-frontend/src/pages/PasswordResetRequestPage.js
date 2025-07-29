import React, { useState } from 'react';
import { passwordResetRequest } from '../api/auth';

function PasswordResetRequestPage() {
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await passwordResetRequest(mail);
      setMessage(data.message || '비밀번호 재설정 이메일이 전송되었습니다.');
    } catch (error) {
      setMessage(`비밀번호 재설정 요청 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <div>
      <h2>비밀번호 재설정 요청</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
        </div>
        <button type="submit">재설정 이메일 받기</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PasswordResetRequestPage;
