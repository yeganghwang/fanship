import React, { useState } from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { recordLogin } from '../api/log';

function LoginPage({ onLoginSuccess }) {
  const [key, setKey] = useState('login');

  const handleLogin = async (data) => {
    try {
      // 로그인 기록
      await recordLogin({
        user_id: data.user_id,
        ip_address: '(unknown)', // 클라이언트에서 IP 주소를 직접 얻는 것은 어렵습니다.
        user_agent: navigator.userAgent,
      }, data.access_token);
    } catch (error) {
      console.error('로그인 기록 실패:', error);
    }
    onLoginSuccess(data);
  };

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
              <LoginForm onLoginSuccess={handleLogin} />
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