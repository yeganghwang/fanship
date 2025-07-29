import React, { useState, useEffect } from 'react';
import { updateUserProfile } from '../../api/user';

function UserProfileEditForm({ userId, token, initialData, onUpdateSuccess }) {
  const [nickname, setNickname] = useState(initialData.nickname || '');
  const [password, setPassword] = useState('');
  const [pfpImgUrl, setPfpImgUrl] = useState(initialData.pfp_img_url || '');
  const [igUrl, setIgUrl] = useState(initialData.ig_url || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setNickname(initialData.nickname || '');
    setPfpImgUrl(initialData.pfp_img_url || '');
    setIgUrl(initialData.ig_url || '');
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        nickname,
        pfp_img_url: pfpImgUrl,
        ig_url: igUrl,
      };
      if (password) {
        updateData.password = password;
      }
      const data = await updateUserProfile(userId, updateData, token);
      setMessage('프로필이 성공적으로 업데이트되었습니다.');
      onUpdateSuccess(data); // 부모 컴포넌트에 업데이트된 데이터 전달
    } catch (error) {
      setMessage(`프로필 업데이트 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>프로필 수정</h2>
      <div>
        <label>닉네임:</label>
        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      </div>
      <div>
        <label>새 비밀번호 (변경 시에만 입력):</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>프로필 이미지 URL:</label>
        <input type="text" value={pfpImgUrl} onChange={(e) => setPfpImgUrl(e.target.value)} />
      </div>
      <div>
        <label>인스타그램 URL:</label>
        <input type="text" value={igUrl} onChange={(e) => setIgUrl(e.target.value)} />
      </div>
      <button type="submit">저장</button>
      <p>{message}</p>
    </form>
  );
}

export default UserProfileEditForm;
