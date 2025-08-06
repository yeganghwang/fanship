import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { login } from '../../api/auth';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ username, password });
      onLoginSuccess(data);
    } catch (error) {
      setMessage(`로그인 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <Card className="w-100" style={{ maxWidth: '400px', margin: 'auto' }}>
      <Card.Body>
        <Card.Title as="h2" className="text-center mb-4">로그인</Card.Title>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>사용자 이름</Form.Label>
            <Form.Control
              type="text"
              placeholder="사용자 이름을 입력하세요"
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

          <Button variant="primary" type="submit" className="w-100">
            로그인
          </Button>

          {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default LoginForm;