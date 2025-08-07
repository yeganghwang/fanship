import React, { useState, useRef } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { login } from '../../api/auth';
import ReCAPTCHA from 'react-google-recaptcha';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const recaptchaRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync();
      if (!recaptchaToken) {
        setMessage('reCAPTCHA 인증을 완료해주세요.');
        return;
      }
      const data = await login({ 
        username, 
        password,
        recaptchaToken 
      });
      onLoginSuccess(data);
    } catch (error) {
      setMessage(`로그인 실패: ${error.message || '알 수 없는 오류'}`);
      recaptchaRef.current.reset();
    }
  };

  return (
    <>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="text"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            size="invisible"
          />
        </div>

        <Button variant="primary" type="submit" className="w-100">
          로그인
        </Button>

        {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
      </Form>
      <div className="mt-3 text-center">
        <Link to="/password-reset-request">비밀번호를 잊으셨나요?</Link>
      </div>
    </>
  );
}

export default LoginForm;