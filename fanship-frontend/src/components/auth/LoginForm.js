import React, { useState } from 'react';
import { login } from '../../api/auth';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ username, password });
      onLoginSuccess(data);
    } catch (error) {
      setMessage(`로그인 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="사용자 이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">로그인</button>
      <p>{message}</p>
    </form>
  );
}

export default LoginForm;