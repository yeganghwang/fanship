import React, { useState } from 'react';
import { register } from '../../api/auth';

function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mail, setMail] = useState('');
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('fan');
  const [message, setMessage] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // 비밀번호 길이 검사 (최소 8자)
    if (value.length > 0 && value.length < 8) {
      setPasswordLengthError(true);
    } else {
      setPasswordLengthError(false);
    }

    // 비밀번호 일치 검사
    if (confirmPassword && value !== confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // 비밀번호 일치 검사
    if (password && value !== password) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setPasswordMatchError(true);
      return;
    }
    if (password.length < 8) {
      setMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      setPasswordLengthError(true);
      return;
    }

    try {
      const userData = { username, password, mail, nickname, position };
      const data = await register(userData);
      setMessage(`회원가입 성공: ${data.username}`);
      // onRegisterSuccess(data); // Optionally, you can pass data to the parent component
    } catch (error) {
      setMessage(`회원가입 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const isSubmitDisabled = !username || !password || !confirmPassword || !mail || !nickname || passwordMatchError || passwordLengthError;

  return (
    <form onSubmit={handleRegister}>
      <h2>회원가입</h2>
      <div>
        <label>사용자 이름:</label>
        <input
          type="text"
          placeholder="사용자 이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>비밀번호:</label>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {passwordLengthError && <p style={{ color: 'red' }}>비밀번호는 최소 8자 이상이어야 합니다.</p>}
      </div>
      <div>
        <label>비밀번호 확인:</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        {passwordMatchError && <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>}
      </div>
      <div>
        <label>이메일:</label>
        <input
          type="email"
          placeholder="이메일"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>닉네임:</label>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
      </div>
      <div>
        <label>사용자 유형:</label>
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="fan">fan</option>
          <option value="celeb">celeb</option>
        </select>
      </div>
      <button type="submit" disabled={isSubmitDisabled}>회원가입</button>
      <p>{message}</p>
    </form>
  );
}

export default RegisterForm;