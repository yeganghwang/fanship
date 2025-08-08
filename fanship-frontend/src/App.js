import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { logout } from './api/auth';
import './App.css';

// Layout
import Header from './components/layout/Header';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage';
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage';
import CompanyListPage from './pages/CompanyListPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import CelebDetailPage from './pages/CelebDetailPage';
import FavoriteListPage from './pages/FavoriteListPage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostCreatePage from './pages/PostCreatePage';
import PostEditPage from './pages/PostEditPage';
import GoodsListPage from './pages/GoodsListPage';
import GoodsDetailPage from './pages/GoodsDetailPage';
import GoodsCreatePage from './pages/GoodsCreatePage';
import GoodsEditPage from './pages/GoodsEditPage';

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
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setToken('');
      setUserId('');
      setCompanyId('');
      setCelebId('');
      setCeoId('');
      setPosition('');
      localStorage.clear();
    }
  };

  return (
    <Router>
      <Header onLogout={handleLogout} userId={userId} />
      <Container className="mt-4">
        <Routes>
          {token ? (
            <>
              <Route path="/" element={
                <HomePage
                  userId={userId}
                  token={token}
                  position={position}
                  companyId={companyId}
                  celebId={celebId}
                  ceoId={ceoId}
                  onLogout={handleLogout}
                />
              } />
              <Route path="/profile" element={<UserProfilePage userId={userId} token={token} />} />
              <Route path="/users/:userId" element={<PublicProfilePage />} />
              <Route path="/companies" element={<CompanyListPage />} />
              <Route path="/companies/:companyId" element={<CompanyDetailPage userId={userId} token={token} />} />
              <Route path="/celebs/:celebId" element={<CelebDetailPage userId={userId} token={token} position={position} />} />
              <Route path="/favorites" element={<FavoriteListPage userId={userId} token={token} />} />
              <Route path="/posts" element={<PostListPage />} />
              <Route path="/posts/create" element={<PostCreatePage token={token} />} />
              <Route path="/posts/:postId" element={<PostDetailPage userId={userId} token={token} position={position} companyId={companyId} />} />
              <Route path="/posts/:postId/edit" element={<PostEditPage token={token} />} />
              <Route path="/goods" element={<GoodsListPage />} />
              <Route path="/goods/create" element={<GoodsCreatePage token={token} />} />
              <Route path="/goods/:goodsId" element={<GoodsDetailPage userId={userId} token={token} position={position} />} />
              <Route path="/goods/:goodsId/edit" element={<GoodsEditPage token={token} />} />
              <Route path="/*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/password-reset-request" element={<PasswordResetRequestPage />} />
              <Route path="/password-reset-confirm" element={<PasswordResetConfirmPage />} />
              <Route path="/*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;