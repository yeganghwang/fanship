import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api/user';
import { Container, Row, Col, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import Avatar from '../components/common/Avatar';

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

    if (userId) fetchUserProfile();
  }, [userId]);

  if (loading) return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
  if (!userProfile) return <Alert variant="warning" className="mt-4 text-center">사용자 정보를 찾을 수 없습니다.</Alert>;

  const { nickname, position, pfp_img_url, ig_url, dob } = userProfile;

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header>
          <h2 className="mb-0" style={{ wordBreak: 'break-word' }}>{nickname}님의 프로필</h2>
        </Card.Header>
        <Card.Body>
          <Row className="gy-4 align-items-start align-items-md-center">
            <Col xs={12} md={4} className="d-flex justify-content-center">
              <div className="ps-md-3" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Avatar url={pfp_img_url} nickname={nickname} size={160} style={{ margin: 0 }} />
              </div>
            </Col>
            <Col xs={12} md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>닉네임:</strong> {nickname}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>사용자 유형:</strong> {position || 'N/A'}
                </ListGroup.Item>
                {dob && (
                  <ListGroup.Item>
                    <strong>생년월일:</strong> {dob}
                  </ListGroup.Item>
                )}
                {ig_url && (
                  <ListGroup.Item>
                    <strong>인스타그램:</strong> <a href={ig_url} target="_blank" rel="noopener noreferrer">{ig_url}</a>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PublicProfilePage;
