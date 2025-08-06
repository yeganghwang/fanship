import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Spinner, Alert, ListGroup, Row, Col, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getCelebDetail } from '../api/celeb';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorite';
import { getPostsByUserId } from '../api/post';

function CelebDetailPage({ userId, token }) {
  const { celebId } = useParams();
  const [celebDetail, setCelebDetail] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const checkFavoriteStatus = async () => {
    if (!userId || !token) return;
    try {
      const response = await getFavorites(userId, token, { limit: 100 });
      const found = response.list.find(fav => fav.celeb_id === parseInt(celebId, 10));
      if (found) {
        setIsFavorite(true);
        setFavoriteId(found.favorite_id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (err) {
      console.error('즐겨찾기 상태 확인 실패:', err);
    }
  };

  useEffect(() => {
    const fetchCelebData = async () => {
      setLoading(true);
      setError(null);
      try {
        const celebResponse = await getCelebDetail(celebId);
        setCelebDetail(celebResponse);

        if (celebResponse && celebResponse.user_id) {
          const postsResponse = await getPostsByUserId(celebResponse.user_id);
          setPosts(postsResponse.list);
        }

        if (userId && token) {
          await checkFavoriteStatus();
        }

      } catch (err) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (celebId) {
      fetchCelebData();
    }
  }, [celebId, userId, token]);

  const handleFavoriteToggle = async () => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(favoriteId, token);
        alert('즐겨찾기에서 삭제되었습니다.');
      } else {
        await addFavorite({ celeb_id: parseInt(celebId, 10) }, token);
        alert('즐겨찾기에 추가되었습니다.');
      }
      await checkFavoriteStatus();
    } catch (err) {
      alert(`작업 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!celebDetail) return <Alert variant="warning">셀럽 정보를 찾을 수 없습니다.</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{celebDetail.nickname}</h1>
        {token && (
          <Button variant={isFavorite ? "outline-danger" : "outline-primary"} onClick={handleFavoriteToggle}>
            {isFavorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가'}
          </Button>
        )}
      </div>

      <Row>
        <Col md={4}>
          <Card className="mb-3">
            {celebDetail.pfp_img_url && <Card.Img variant="top" src={celebDetail.pfp_img_url} />}
            <Card.Body>
              <Card.Title>{celebDetail.nickname}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{celebDetail.celeb_type}</Card.Subtitle>
              <ListGroup variant="flush">
                <ListGroup.Item>소속: {celebDetail.company_name || '없음'}</ListGroup.Item>
                {celebDetail.dob && <ListGroup.Item>생년월일: {celebDetail.dob}</ListGroup.Item>}
                {celebDetail.ig_url && 
                  <ListGroup.Item>
                    인스타그램: <a href={celebDetail.ig_url} target="_blank" rel="noopener noreferrer">바로가기</a>
                  </ListGroup.Item>
                }
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header as="h5">작성한 게시글</Card.Header>
            <ListGroup variant="flush">
              {posts.length > 0 ? (
                posts.map(post => (
                  <LinkContainer to={`/posts/${post.post_id}`} key={post.post_id}>
                    <ListGroup.Item action>{post.title}</ListGroup.Item>
                  </LinkContainer>
                ))
              ) : (
                <ListGroup.Item>작성한 게시글이 없습니다.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default CelebDetailPage;
