import React from 'react';

function UserProfileDisplay({ userProfile }) {
  return (
    <div>
      <h2>사용자 프로필</h2>
      <p>닉네임: {userProfile.nickname}</p>
      <p>사용자 유형: {userProfile.position}</p>
      {userProfile.pfp_img_url && <p>프로필 이미지: <img src={userProfile.pfp_img_url} alt="프로필" style={{ width: '100px', height: '100px' }} /></p>}
      {userProfile.ig_url && <p>인스타그램 URL: <a href={userProfile.ig_url} target="_blank" rel="noopener noreferrer">{userProfile.ig_url}</a></p>}
    </div>
  );
}

export default UserProfileDisplay;
