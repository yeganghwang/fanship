import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { passwordResetConfirm } from '../api/auth';

function PasswordResetConfirmPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('유효한 재설정 토큰이 없습니다.');
      return;
    }
    setMessage('');
    setError('');
    try {
      const data = await passwordResetConfirm(token, newPassword);
      setMessage(data.message || '비밀번호가 성공적으로 재설정되었습니다.');
      setSuccess(true);
    } catch (err) {
      setError(`비밀번호 재설정 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body>
          <Card.Title as="h2" className="text-center mb-4">새 비밀번호 설정</Card.Title>
          {success ? (
            <div className="text-center">
              <Alert variant="success">{message}</Alert>
              <Link to="/login">
                <Button variant="primary">로그인 페이지로 이동</Button>
              </Link>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group className="mb-3" controlId="formNewPassword">
                <Form.Label>새 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Form.Text muted>
                  비밀번호는 최소 8자 이상이어야 합니다.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100" disabled={!token || newPassword.length < 8}>
                비밀번호 재설정
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PasswordResetConfirmPage;
