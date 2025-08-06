import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { passwordResetRequest } from '../api/auth';

function PasswordResetRequestPage() {
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const data = await passwordResetRequest(mail);
      setMessage(data.message || '비밀번호 재설정 이메일이 전송되었습니다. 이메일을 확인해주세요.');
    } catch (err) {
      setError(`요청 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body>
          <Card.Title as="h2" className="text-center mb-4">비밀번호 재설정</Card.Title>
          <p className="text-center text-muted mb-4">가입 시 사용한 이메일을 입력하시면, 비밀번호 재설정 링크를 보내드립니다.</p>
          <Form onSubmit={handleSubmit}>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3" controlId="formResetEmail">
              <Form.Label>이메일 주소</Form.Label>
              <Form.Control
                type="email"
                placeholder="이메일 입력"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100">
              재설정 이메일 받기
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PasswordResetRequestPage;
