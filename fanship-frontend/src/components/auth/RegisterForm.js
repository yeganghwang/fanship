import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { register } from '../../api/auth';
import { getCompanyList } from '../../api/company';
import ReCAPTCHA from 'react-google-recaptcha';

function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mail, setMail] = useState('');
  const [nickname, setNickname] = useState('');
  const recaptchaRef = useRef(null);
  const [position, setPosition] = useState('fan');
  const [companyId, setCompanyId] = useState('');
  const [celebType, setCelebType] = useState('메이드');
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getCompanyList({ limit: 100 }); // 모든 회사 목록을 가져옵니다.
        setCompanies(response.list);
      } catch (error) {
        console.error('회사 목록을 불러오는데 실패했습니다.', error);
      }
    };

    if (position === 'celeb') {
      fetchCompanies();
    }
  }, [position]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordLengthError(value.length > 0 && value.length < 8);
    if (confirmPassword) {
      setPasswordMatchError(value !== confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatchError(password !== value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      setPasswordMatchError(true);
      return;
    }
    if (password.length < 8) {
      setMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      setPasswordLengthError(true);
      return;
    }

    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync();
      if (!recaptchaToken) {
        setMessage('reCAPTCHA 인증을 완료해주세요.');
        return;
      }
      const userData = { 
        username, 
        password, 
        mail, 
        nickname, 
        position,
        recaptchaToken 
      };
      if (position === 'celeb') {
        userData.company_id = companyId;
        userData.celeb_type = celebType;
      }
      const data = await register(userData);
      setMessage('');
      alert(`회원가입 성공: ${data.username}님, 환영합니다!`);
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      setMessage(`회원가입 실패: ${error.message || '알 수 없는 오류'}`);
      recaptchaRef.current.reset();
    }
  };

  const isSubmitDisabled = !username || !password || !confirmPassword || !mail || !nickname || passwordMatchError || passwordLengthError || (position === 'celeb' && !companyId);

  return (
    <Card className="w-100" style={{ maxWidth: '500px', margin: 'auto' }}>
      <Card.Body>
        <Card.Title as="h2" className="text-center mb-4">회원가입</Card.Title>
        <Form onSubmit={handleRegister}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRegisterUsername">
                <Form.Label>아이디</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="로그인 시 아이디"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRegisterNickname">
                <Form.Label>닉네임</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formRegisterEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              isInvalid={passwordLengthError}
              required
            />
            <Form.Control.Feedback type="invalid">
              비밀번호는 최소 8자 이상이어야 합니다.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterConfirmPassword">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              isInvalid={passwordMatchError}
              required
            />
            <Form.Control.Feedback type="invalid">
              비밀번호가 일치하지 않습니다.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterPosition">
            <Form.Label>사용자 유형</Form.Label>
            <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="fan">팬</option>
              <option value="celeb">셀럽</option>
            </Form.Select>
            <Form.Text className="text-muted">
              팬은 콘텐츠 소비자, 셀럽은 콘텐츠 제작자를 의미합니다.<br />사장님은 개발자가 직접 계정을 만들어 드립니다.
            </Form.Text>
          </Form.Group>

          {position === 'celeb' && (
            <>
              <Form.Group className="mb-3" controlId="formRegisterCompany">
                <Form.Label>소속 회사</Form.Label>
                <Form.Select value={companyId} onChange={(e) => setCompanyId(e.target.value)} required>
                  <option value="">회사를 선택하세요</option>
                  {companies.map(company => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formRegisterCelebType">
                <Form.Label>셀럽 유형</Form.Label>
                <Form.Select value={celebType} onChange={(e) => setCelebType(e.target.value)}>
                  <option value="메이드">메이드</option>
                  <option value="집사">집사</option>
                </Form.Select>
              </Form.Group>
            </>
          )}

          <div className="mb-3">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              size="invisible"
            />
          </div>

          <Button variant="primary" type="submit" className="w-100" disabled={isSubmitDisabled}>
            회원가입
          </Button>

          {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default RegisterForm;
