import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { updateUserProfile } from '../../api/user';
import { uploadImage } from '../../api/upload';

function UserProfileEditForm({ userId, token, initialData, onUpdateSuccess }) {
  const [nickname, setNickname] = useState(initialData.nickname || '');
  const [pfpImgUrl, setPfpImgUrl] = useState(initialData.pfp_img_url || '');
  const [igUrl, setIgUrl] = useState(initialData.ig_url || '');
  const [message, setMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | success | error
  const [uploadError, setUploadError] = useState('');
  let initialYear = '';
  let initialMonth = '';
  let initialDay = '';
  if (initialData.dob && typeof initialData.dob === 'string' && initialData.dob.length === 10) {
    const [y, m, d] = initialData.dob.split('-');
    initialYear = y;
    initialMonth = String(parseInt(m, 10));
    initialDay = String(parseInt(d, 10));
  }
  const [birthYear, setBirthYear] = useState(initialYear);
  const [birthMonth, setBirthMonth] = useState(initialMonth);
  const [birthDay, setBirthDay] = useState(initialDay);

  useEffect(() => {
    setNickname(initialData.nickname || '');
    setPfpImgUrl(initialData.pfp_img_url || '');
    setIgUrl(initialData.ig_url || '');
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (uploadStatus === 'uploading') return;
    try {

      let dob = null;
      if(birthYear && birthMonth && birthDay) {
        dob = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
      }

      const updateData = {
        nickname,
        pfp_img_url: pfpImgUrl,
        ig_url: igUrl,
        dob: dob
      };
      const data = await updateUserProfile(userId, updateData, token);
      onUpdateSuccess(data); // Let parent component handle success message
    } catch (error) {
      setMessage(`프로필 업데이트 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  // 이미지 파일 업로드 핸들러
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('uploading');
    setUploadError('');
    try {
      const url = await uploadImage(file, token);
      setPfpImgUrl(url);
      setUploadStatus('success');
    } catch (err) {
      setUploadStatus('error');
      setUploadError('이미지 업로드 실패: ' + (err.response?.data?.message || err.message));
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

      <Form.Group className="mb-3" controlId="formPfpUpload">
        <Form.Label>프로필 이미지 업로드</Form.Label>
        <Form.Control 
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploadStatus === 'uploading'}
        />
        {uploadStatus === 'uploading' && (
          <div className="mt-2"><Spinner animation="border" size="sm" /> 이미지 업로드 중...</div>
        )}
        {uploadStatus === 'success' && pfpImgUrl && (
          <div className="mt-2 text-success">업로드 완료! {/* <a href={pfpImgUrl} target="_blank" rel="noopener noreferrer">이미지 보기</a>*/}</div>
        )}
        {uploadStatus === 'error' && (
          <div className="mt-2 text-danger">{uploadError}</div>
        )}
        {/* {pfpImgUrl && uploadStatus !== 'success' && (
          <div className="mt-2">현재 이미지: <a href={pfpImgUrl} target="_blank" rel="noopener noreferrer">{pfpImgUrl}</a></div>
        )} */}
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
          <Form.Group className="mb-3" controlId="formRegisterDob">
              <Form.Label>생년월일</Form.Label>
              <Row>
                <Col>
                  <Form.Select value={birthYear} onChange={e => setBirthYear(e.target.value)} required>
                    <option value="">년</option>
                    <option value="9999">9999년 (비공개)</option>
                    {Array.from({length: 100}, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}년</option>;
                    })}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select value={birthMonth} onChange={e => setBirthMonth(e.target.value)} required disabled={birthYear === "9999"}>
                    <option value="">월</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}월</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select value={birthDay} onChange={e => setBirthDay(e.target.value)} required disabled={birthYear === "9999"}>
                    <option value="">일</option>
                    {Array.from({length: 31}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}일</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Form.Text className="text-muted">
                생년 비공개를 원하는 경우, 9999년을 선택하세요.
              </Form.Text>
            </Form.Group>
      <Form.Group className="mb-3" controlId="formDob">
        <Form.Label>생년월일 (선택)</Form.Label>
        
      </Form.Group>

      <Button variant="primary" type="submit" disabled={uploadStatus === 'uploading'}>
        프로필 저장
      </Button>
    </Form>
  );
}

export default UserProfileEditForm;