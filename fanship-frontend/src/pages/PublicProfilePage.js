import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api/user';

function PublicProfilePage() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(userId);
        setUserProfile(data);
      } catch (err) {
        setError(err.message || '프로필을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!userProfile) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{userProfile.nickname}님의 프로필</h2>
      <p>사용자 유형: {userProfile.position}</p>
      {userProfile.pfp_img_url && <p>프로필 이미지: <img src={userProfile.pfp_img_url} alt="프로필" style={{ width: '100px', height: '100px' }} /></p>}
      {userProfile.ig_url && <p>인스타그램: <a href={userProfile.ig_url} target="_blank" rel="noopener noreferrer">{userProfile.ig_url}</a></p>}
    </div>
  );
}

export default PublicProfilePage;
