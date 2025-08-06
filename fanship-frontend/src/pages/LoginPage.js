import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

function LoginPage({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  // 회원가입 성공 시 로그인 폼으로 전환
  const handleRegisterSuccess = () => {
    setIsRegistering(false);
  };

  return (
    <div>
      {isRegistering ? (
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      ) : (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      )}
      <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? '로그인으로 돌아가기' : '회원가입'}
      </button>
    </div>
  );
}

export default LoginPage;