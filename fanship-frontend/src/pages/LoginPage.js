import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

function LoginPage({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div>
      {isRegistering ? (
        <RegisterForm />
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