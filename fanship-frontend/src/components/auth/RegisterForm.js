import React, { useState } from 'react';
import { register } from '../../api/auth';

function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('fan');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = { username, password, mail, nickname, position };
      const data = await register(userData);
      setMessage(`회원가입 성공: ${data.username}`);
      // onRegisterSuccess(data); // Optionally, you can pass data to the parent component
    } catch (error) {
      setMessage(`회원가입 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>회원가입</h2>
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
      <input
        type="email"
        placeholder="이메일"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      />
      <select value={position} onChange={(e) => setPosition(e.target.value)}>
        <option value="fan">fan</option>
        <option value="celeb">celeb</option>
      </select>
      <button type="submit">회원가입</button>
      <p>{message}</p>
    </form>
  );
}

export default RegisterForm;