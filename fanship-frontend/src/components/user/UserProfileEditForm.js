import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { updateUserProfile } from '../../api/user';

function UserProfileEditForm({ userId, token, initialData, onUpdateSuccess }) {
  const [nickname, setNickname] = useState(initialData.nickname || '');
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
    setMessage('');
    try {
      const updateData = {
        nickname,
        pfp_img_url: pfpImgUrl,
        ig_url: igUrl,
      };
      const data = await updateUserProfile(userId, updateData, token);
      onUpdateSuccess(data); // Let parent component handle success message
    } catch (error) {
      setMessage(`프로필 업데이트 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {message && <Alert variant="danger">{message}</Alert>}
      <Form.Group className="mb-3" controlId="formNickname">
        <Form.Label>닉네임</Form.Label>
        <Form.Control 
          type="text" 
          value={nickname} 
          onChange={(e) => setNickname(e.target.value)} 
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPfpUrl">
        <Form.Label>프로필 이미지 URL</Form.Label>
        <Form.Control 
          type="text" 
          value={pfpImgUrl} 
          onChange={(e) => setPfpImgUrl(e.target.value)} 
          placeholder="https://example.com/image.jpg"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formIgUrl">
        <Form.Label>인스타그램 URL</Form.Label>
        <Form.Control 
          type="text" 
          value={igUrl} 
          onChange={(e) => setIgUrl(e.target.value)} 
          placeholder="https://instagram.com/username"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        프로필 저장
      </Button>
    </Form>
  );
}

export default UserProfileEditForm;