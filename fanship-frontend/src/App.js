import React, { useState } from 'react';
import { register, login, logout } from './api/auth';
import './App.css'; // 기본 CSS 파일 사용

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('fan'); // 기본값 'fan'
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = { username, password, mail, nickname, position };
      const data = await register(userData);
      setMessage(`회원가입 성공: ${data.username}`);
      setIsRegistering(false); // 회원가입 성공 후 로그인 폼으로 전환
      setUsername('');
      setPassword('');
      setMail('');
      setNickname('');
      setPosition('fan');
    } catch (error) {
      setMessage(`회원가입 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = { username, password };
      const data = await login(credentials);
      setToken(data.access_token);
      setUserId(data.user_id);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userId', data.user_id);
      setMessage(`로그인 성공! 환영합니다, ${username}!`);
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage(`로그인 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(token);
      setToken('');
      setUserId('');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setMessage('로그아웃 되었습니다.');
    } catch (error) {
      setMessage(`로그아웃 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fanship Frontend</h1>
        {token ? (
          <div>
            <p>{message}</p>
            <p>현재 로그인된 사용자 ID: {userId}</p>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <div>
            {isRegistering ? (
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
                  <option value="manager">manager</option>
                  <option value="celeb">celeb</option>
                  <option value="ceo">ceo</option>
                </select>
                <button type="submit">회원가입</button>
                <button type="button" onClick={() => setIsRegistering(false)}>로그인으로 돌아가기</button>
                <p>{message}</p>
              </form>
            ) : (
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
                <button type="button" onClick={() => setIsRegistering(true)}>회원가입</button>
                <p>{message}</p>
              </form>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;