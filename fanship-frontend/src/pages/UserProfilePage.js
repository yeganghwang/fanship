import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/user';
import UserProfileDisplay from '../components/user/UserProfileDisplay';
import UserProfileEditForm from '../components/user/UserProfileEditForm';
import ChangePasswordForm from '../components/user/ChangePasswordForm';

function UserProfilePage({ userId, token }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(userId, token);
        setUserProfile(data);
      } catch (error) {
        setMessage(`프로필 불러오기 실패: ${error.message || '알 수 없는 오류'}`);
      }
    };

    if (userId && token) {
      fetchUserProfile();
    }
  }, [userId, token]);

  const handleProfileUpdateSuccess = (updatedData) => {
    setUserProfile(updatedData);
    setIsEditingProfile(false);
    setMessage('프로필이 성공적으로 업데이트되었습니다.');
  };

  const handlePasswordChangeSuccess = () => {
    setIsChangingPassword(false);
    setMessage('비밀번호가 성공적으로 변경되었습니다.');
  };

  if (!userProfile) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>내 프로필</h1>
      {message && <p>{message}</p>}

      {!isEditingProfile && !isChangingPassword && (
        <UserProfileDisplay userProfile={userProfile} />
      )}

      {isEditingProfile && (
        <UserProfileEditForm
          userId={userId}
          token={token}
          initialData={userProfile}
          onUpdateSuccess={handleProfileUpdateSuccess}
        />
      )}

      {isChangingPassword && (
        <ChangePasswordForm token={token} onChangeSuccess={handlePasswordChangeSuccess} />
      )}

      <div>
        <button onClick={() => {
          setIsEditingProfile(!isEditingProfile);
          setIsChangingPassword(false);
          setMessage('');
        }}>
          {isEditingProfile ? '프로필 수정 취소' : '프로필 수정'}
        </button>
        <button onClick={() => {
          setIsChangingPassword(!isChangingPassword);
          setIsEditingProfile(false);
          setMessage('');
        }}>
          {isChangingPassword ? '비밀번호 변경 취소' : '비밀번호 변경'}
        </button>
      </div>
    </div>
  );
}

export default UserProfilePage;