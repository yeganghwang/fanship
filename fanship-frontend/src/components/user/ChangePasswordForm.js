import React, { useState } from 'react';
import { changePassword } from '../../api/auth';

function ChangePasswordForm({ token, onChangeSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [newPasswordLengthError, setNewPasswordLengthError] = useState(false);

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    // 비밀번호 길이 검사 (최소 8자)
    if (value.length > 0 && value.length < 8) {
      setNewPasswordLengthError(true);
    } else {
      setNewPasswordLengthError(false);
    }

    // 비밀번호 일치 검사
    if (confirmNewPassword && value !== confirmNewPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleConfirmNewPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmNewPassword(value);

    // 비밀번호 일치 검사
    if (newPassword && value !== newPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setPasswordMatchError(true);
      return;
    }
    if (newPassword.length < 8) {
      setMessage('새 비밀번호는 최소 8자 이상이어야 합니다.');
      setNewPasswordLengthError(true);
      return;
    }
    if (!newPassword || !currentPassword) {
      setMessage('모든 비밀번호 필드를 채워주세요.');
      return;
    }

    try {
      const data = await changePassword(currentPassword, newPassword, token);
      setMessage(data.message || '비밀번호가 성공적으로 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordMatchError(false);
      setNewPasswordLengthError(false);
      if (onChangeSuccess) {
        onChangeSuccess();
      }
    } catch (error) {
      setMessage(`비밀번호 변경 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const isSubmitDisabled = !currentPassword || !newPassword || !confirmNewPassword || passwordMatchError || newPasswordLengthError;

  return (
    <form onSubmit={handleSubmit}>
      <h2>비밀번호 변경</h2>
      <div>
        <label>현재 비밀번호:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>새 비밀번호:</label>
        <input
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          required
        />
        {newPasswordLengthError && <p style={{ color: 'red' }}>비밀번호는 최소 8자 이상이어야 합니다.</p>}
      </div>
      <div>
        <label>새 비밀번호 확인:</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          required
        />
        {passwordMatchError && <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>}
      </div>
      <button type="submit" disabled={isSubmitDisabled}>비밀번호 변경</button>
      <p>{message}</p>
    </form>
  );
}

export default ChangePasswordForm;
