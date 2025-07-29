import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/user';
import UserProfileDisplay from '../components/user/UserProfileDisplay';
import UserProfileEditForm from '../components/user/UserProfileEditForm';

function UserProfilePage({ userId, token }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleUpdateSuccess = (updatedData) => {
    setUserProfile(updatedData);
    setIsEditing(false);
    setMessage('프로필이 성공적으로 업데이트되었습니다.');
  };

  if (!userProfile) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>내 프로필</h1>
      {message && <p>{message}</p>}
      {isEditing ? (
        <UserProfileEditForm
          userId={userId}
          token={token}
          initialData={userProfile}
          onUpdateSuccess={handleUpdateSuccess}
        />
      ) : (
        <UserProfileDisplay userProfile={userProfile} />
      )}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? '취소' : '프로필 수정'}
      </button>
    </div>
  );
}

export default UserProfilePage;
