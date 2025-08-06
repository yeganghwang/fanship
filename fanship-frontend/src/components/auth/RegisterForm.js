import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { register } from '../../api/auth';

function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mail, setMail] = useState('');
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('fan');
  const [message, setMessage] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordLengthError(value.length > 0 && value.length < 8);
    if (confirmPassword) {
      setPasswordMatchError(value !== confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatchError(password !== value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setPasswordMatchError(true);
      return;
    }
    if (password.length < 8) {
      setMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      setPasswordLengthError(true);
      return;
    }

    try {
      const userData = { username, password, mail, nickname, position };
      const data = await register(userData);
      setMessage('');
      alert(`회원가입 성공: ${data.username}님, 환영합니다!`);
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      setMessage(`회원가입 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const isSubmitDisabled = !username || !password || !confirmPassword || !mail || !nickname || passwordMatchError || passwordLengthError;

  return (
    <Card className="w-100" style={{ maxWidth: '500px', margin: 'auto' }}>
      <Card.Body>
        <Card.Title as="h2" className="text-center mb-4">회원가입</Card.Title>
        <Form onSubmit={handleRegister}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRegisterUsername">
                <Form.Label>사용자 이름</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="사용자 이름"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRegisterNickname">
                <Form.Label>닉네임</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formRegisterEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              isInvalid={passwordLengthError}
              required
            />
            <Form.Control.Feedback type="invalid">
              비밀번호는 최소 8자 이상이어야 합니다.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterConfirmPassword">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              isInvalid={passwordMatchError}
              required
            />
            <Form.Control.Feedback type="invalid">
              비밀번호가 일치하지 않습니다.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterPosition">
            <Form.Label>사용자 유형</Form.Label>
            <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="fan">팬</option>
              <option value="celeb">셀럽</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={isSubmitDisabled}>
            회원가입
          </Button>

          {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default RegisterForm;