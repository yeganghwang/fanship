import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Spinner, Alert, ListGroup, Pagination, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getCelebsByCompanyId } from '../api/company';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorite';
import { getPostsByUserId } from '../api/post';

function CompanyDetailPage({ userId, token }) {
  const { companyId } = useParams();
  const [companyName, setCompanyName] = useState('');
  const [celebs, setCelebs] = useState([]);
  const [ceoPosts, setCeoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Adjusted for better layout
  const [totalPages, setTotalPages] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const checkFavoriteStatus = async () => {
    if (!userId || !token) return;
    try {
      const response = await getFavorites(userId, token, { limit: 100 }); // Check all favorites
      const found = response.list.find(fav => fav.company_id === parseInt(companyId, 10));
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
    const fetchCompanyData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch celebs and company info
        const celebsResponse = await getCelebsByCompanyId(companyId, { page, limit });
        setCelebs(celebsResponse.list);
        setTotalPages(celebsResponse.pagination.total_pages);
        setCompanyName(celebsResponse.company_name);

        // Fetch CEO posts if ceo_id exists
        if (celebsResponse.ceo_id) {
          const ceoPostsResponse = await getPostsByUserId(celebsResponse.ceo_id);
          setCeoPosts(ceoPostsResponse.list);
        }

        // Check favorite status
        if (userId && token) {
          await checkFavoriteStatus();
        }

      } catch (err) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId, page, limit, userId, token]);

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
        await addFavorite({ company_id: parseInt(companyId, 10) }, token);
        alert('즐겨찾기에 추가되었습니다.');
      }
      await checkFavoriteStatus(); // Re-check status after action
    } catch (err) {
      alert(`작업 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === page} onClick={() => setPage(number)}>
          {number}
        </Pagination.Item>,
      );
    }
    return <Pagination className="justify-content-center">{items}</Pagination>;
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!companyName) return <Alert variant="warning">회사 정보를 찾을 수 없습니다.</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{companyName}</h1>
        {token && (
          <Button variant={isFavorite ? "outline-danger" : "outline-primary"} onClick={handleFavoriteToggle}>
            {isFavorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가'}
          </Button>
        )}
      </div>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header as="h5">소속 셀럽</Card.Header>
            <ListGroup variant="flush">
              {celebs.length > 0 ? (
                celebs.map((celeb) => (
                  <LinkContainer to={`/celebs/${celeb.celeb_id}`} key={celeb.celeb_id}>
                    <ListGroup.Item action>
                      {celeb.nickname} <small className="text-muted">({celeb.celeb_type})</small>
                    </ListGroup.Item>
                  </LinkContainer>
                ))
              ) : (
                <ListGroup.Item>소속된 셀럽이 없습니다.</ListGroup.Item>
              )}
            </ListGroup>
            {celebs.length > 0 && <Card.Footer>{renderPagination()}</Card.Footer>}
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header as="h5">CEO 작성글</Card.Header>
            <ListGroup variant="flush">
              {ceoPosts.length > 0 ? (
                ceoPosts.map(post => (
                  <LinkContainer to={`/posts/${post.post_id}`} key={post.post_id}>
                    <ListGroup.Item action>{post.title}</ListGroup.Item>
                  </LinkContainer>
                ))
              ) : (
                <ListGroup.Item>CEO가 작성한 글이 없습니다.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default CompanyDetailPage;