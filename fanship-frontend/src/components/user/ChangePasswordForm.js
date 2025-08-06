import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { changePassword } from '../../api/auth';

function ChangePasswordForm({ token, onChangeSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [newPasswordLengthError, setNewPasswordLengthError] = useState(false);

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setNewPasswordLengthError(value.length > 0 && value.length < 8);
    if (confirmNewPassword) {
      setPasswordMatchError(value !== confirmNewPassword);
    }
  };

  const handleConfirmNewPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmNewPassword(value);
    setPasswordMatchError(newPassword !== value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmNewPassword) {
      setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setPasswordMatchError(true);
      return;
    }
    if (newPassword.length < 8) {
      setError('새 비밀번호는 최소 8자 이상이어야 합니다.');
      setNewPasswordLengthError(true);
      return;
    }

    try {
      await changePassword(currentPassword, newPassword, token);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordMatchError(false);
      setNewPasswordLengthError(false);
      if (onChangeSuccess) {
        onChangeSuccess();
      }
    } catch (err) {
      setError(`비밀번호 변경 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  const isSubmitDisabled = !currentPassword || !newPassword || !confirmNewPassword || passwordMatchError || newPasswordLengthError;

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3" controlId="formCurrentPassword">
        <Form.Label>현재 비밀번호</Form.Label>
        <Form.Control
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNewPassword">
        <Form.Label>새 비밀번호</Form.Label>
        <Form.Control
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          isInvalid={newPasswordLengthError}
          required
        />
        <Form.Control.Feedback type="invalid">
          비밀번호는 최소 8자 이상이어야 합니다.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formConfirmNewPassword">
        <Form.Label>새 비밀번호 확인</Form.Label>
        <Form.Control
          type="password"
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          isInvalid={passwordMatchError}
          required
        />
        <Form.Control.Feedback type="invalid">
          비밀번호가 일치하지 않습니다.
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isSubmitDisabled}>
        비밀번호 변경
      </Button>
    </Form>
  );
}

export default ChangePasswordForm;
