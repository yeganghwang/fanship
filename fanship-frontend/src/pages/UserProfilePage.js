import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Card, Spinner, Alert } from 'react-bootstrap';
import { getUserProfile } from '../api/user';
import UserProfileDisplay from '../components/user/UserProfileDisplay';
import UserProfileEditForm from '../components/user/UserProfileEditForm';
import ChangePasswordForm from '../components/user/ChangePasswordForm';

function UserProfilePage({ userId, token }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserProfile(userId, token);
      setUserProfile(data);
    } catch (err) {
      setError(`프로필 불러오기 실패: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchUserProfile();
    }
  }, [userId, token]);

  const handleProfileUpdateSuccess = (updatedData) => {
    setUserProfile(updatedData);
    setMessage('프로필이 성공적으로 업데이트되었습니다.');
    setActiveTab('profile'); // Switch back to display tab
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  const handlePasswordChangeSuccess = () => {
    setMessage('비밀번호가 성공적으로 변경되었습니다.');
    setActiveTab('profile'); // Switch back to display tab
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!userProfile) return <Alert variant="warning">사용자 프로필을 찾을 수 없습니다.</Alert>;

  return (
    <>
      <h1 className="mb-4">내 프로필</h1>
      {message && <Alert variant="success">{message}</Alert>}
      <Card>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="user-profile-tabs"
          className="mb-3"
          justify
        >
          <Tab eventKey="profile" title="프로필 보기">
            <Card.Body>
              <UserProfileDisplay userProfile={userProfile} />
            </Card.Body>
          </Tab>
          <Tab eventKey="edit-profile" title="프로필 수정">
            <Card.Body>
              <UserProfileEditForm
                userId={userId}
                token={token}
                initialData={userProfile}
                onUpdateSuccess={handleProfileUpdateSuccess}
              />
            </Card.Body>
          </Tab>
          <Tab eventKey="change-password" title="비밀번호 변경">
            <Card.Body>
              <ChangePasswordForm token={token} onChangeSuccess={handlePasswordChangeSuccess} />
            </Card.Body>
          </Tab>
        </Tabs>
      </Card>
    </>
  );
}

export default UserProfilePage;