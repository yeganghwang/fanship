import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { passwordResetConfirm } from '../api/auth';

function PasswordResetConfirmPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('유효한 재설정 토큰이 없습니다.');
      return;
    }
    try {
      const data = await passwordResetConfirm(token, newPassword);
      setMessage(data.message || '비밀번호가 성공적으로 재설정되었습니다.');
    } catch (error) {
      setMessage(`비밀번호 재설정 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <div>
      <h2>비밀번호 재설정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>새 비밀번호:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">비밀번호 재설정</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PasswordResetConfirmPage;
