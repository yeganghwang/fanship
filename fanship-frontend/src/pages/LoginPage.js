import React, { useState } from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

function LoginPage({ onLoginSuccess }) {
  const [key, setKey] = useState('login');

  const handleRegisterSuccess = () => {
    setKey('login'); // 회원가입 성공 시 로그인 탭으로 전환
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body>
          <Tabs
            id="login-register-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            justify
          >
            <Tab eventKey="login" title="로그인">
              <LoginForm onLoginSuccess={onLoginSuccess} />
            </Tab>
            <Tab eventKey="register" title="회원가입">
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginPage;