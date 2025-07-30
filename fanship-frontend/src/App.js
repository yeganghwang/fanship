import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { logout } from './api/auth';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage';
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage';
import CompanyListPage from './pages/CompanyListPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import CelebDetailPage from './pages/CelebDetailPage';
import FavoriteListPage from './pages/FavoriteListPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId') || '');
  const [celebId, setCelebId] = useState(localStorage.getItem('celebId') || '');
  const [ceoId, setCeoId] = useState(localStorage.getItem('ceoId') || '');
  const [position, setPosition] = useState(localStorage.getItem('position') || '');

  const handleLoginSuccess = (data) => {
    setToken(data.access_token);
    setUserId(data.user_id);
    setPosition(data.position);
    setCompanyId(data.company_id);
    setCelebId(data.celeb_id);
    setCeoId(data.ceo_id);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userId', data.user_id);
    localStorage.setItem('companyId', data.company_id);
    localStorage.setItem('celebId', data.celeb_id);
    localStorage.setItem('ceoId', data.ceo_id);
    localStorage.setItem('position', data.position);
  };

  const handleLogout = async () => {
    try {
      await logout(token);
      setToken('');
      setUserId('');
      setCompanyId('');
      setCelebId('');
      setCeoId('');
      setPosition('');
      localStorage.clear();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {token ? (
            <nav>
              <Link to="/">홈</Link> |
              <Link to="/profile">내 프로필</Link> |
              <Link to="/companies">회사 목록</Link> |
              <Link to="/favorites">즐겨찾기</Link> |
              <button onClick={handleLogout}>로그아웃</button>
            </nav>
          ) : (
            <nav>
              <Link to="/">로그인</Link> |
              <Link to="/password-reset-request">비밀번호 재설정</Link>
            </nav>
          )}
          <Routes>
            {token ? (
              <>
                <Route path="/" element={
                  <HomePage
                    userId={userId}
                    position={position}
                    companyId={companyId}
                    celebId={celebId}
                    ceoId={ceoId}
                    onLogout={handleLogout}
                  />
                } />
                <Route path="/profile" element={<UserProfilePage userId={userId} token={token} />} />
                <Route path="/companies" element={<CompanyListPage />} />
                <Route path="/companies/:companyId" element={<CompanyDetailPage userId={userId} token={token} />} />
                <Route path="/celebs/:celebId" element={<CelebDetailPage userId={userId} token={token} />} />
                <Route path="/favorites" element={<FavoriteListPage userId={userId} token={token} />} />
                <Route path="/*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/password-reset-request" element={<PasswordResetRequestPage />} />
                <Route path="/password-reset-confirm" element={<PasswordResetConfirmPage />} />
                <Route path="/*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
