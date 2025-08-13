import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, ListGroup, Row, Col, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getPosts } from '../api/post';
import { getCompanyList } from '../api/company';
import { getGoodsList } from '../api/goods';
import { getFavorites } from '../api/favorite';

function HomePage({ userId, token, position, celebId }) {
  const [recentPosts, setRecentPosts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [recentGoods, setRecentGoods] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      try {
        const [postsResponse, companiesResponse, goodsResponse] = await Promise.all([
          getPosts({ limit: 5 }),
          getCompanyList({ limit: 5 }),
          getGoodsList({ limit: 5 })
        ]);
        
        setRecentPosts(postsResponse.list);
        setCompanies(companiesResponse.list);
        setRecentGoods(goodsResponse.list);

      } catch (err) {
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId && token) {
        try {
          const favoritesResponse = await getFavorites(userId, token, { limit: 5 });
          setFavorites(favoritesResponse.list);
        } catch (err) {
          console.error('즐겨찾기 목록을 불러오는데 실패했습니다:', err);
          setFavorites([]);
        }
      } else {
        setFavorites([]); // 로그아웃 시 즐겨찾기 목록 초기화
      }
    };

    fetchFavorites();
  }, [userId, token]);

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      {position === 'celeb' && celebId && (
        <Card className="text-center mb-4 bg-primary text-white">
          <Card.Body>
            <Card.Title as="h2">마이 페이지</Card.Title>
            <Card.Text>내 프로필과 스케줄을 관리하고 팬들과 소통하세요.</Card.Text>
            <LinkContainer to={`/celebs/${celebId}`}>
              <Button variant="light">내 페이지로 가기</Button>
            </LinkContainer>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header as="h5">최신 게시글</Card.Header>
            <ListGroup variant="flush">
              {recentPosts.length > 0 ? (
                recentPosts.map(post => (
                  <LinkContainer to={`/posts/${post.post_id}`} key={post.post_id}>
                    <ListGroup.Item action>{post.title}</ListGroup.Item>
                  </LinkContainer>
                ))
              ) : (
                <ListGroup.Item>최신 게시글이 없습니다.</ListGroup.Item>
              )}
            </ListGroup>
            <Card.Footer className="text-end">
                <LinkContainer to="/posts">
                    <Button variant="secondary" size="sm">더보기</Button>
                </LinkContainer>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header as="h5">주요 회사</Card.Header>
            <ListGroup variant="flush">
              {companies.length > 0 ? (
                companies.map(company => (
                  <LinkContainer to={`/companies/${company.company_id}`} key={company.company_id}>
                    <ListGroup.Item action>{company.company_name}</ListGroup.Item>
                  </LinkContainer>
                ))
              ) : (
                <ListGroup.Item>등록된 회사가 없습니다.</ListGroup.Item>
              )}
            </ListGroup>
            <Card.Footer className="text-end">
                <LinkContainer to="/companies">
                    <Button variant="secondary" size="sm">더보기</Button>
                </LinkContainer>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
            <Card>
                <Card.Header as="h5">최신 굿즈</Card.Header>
                <ListGroup variant="flush">
                {recentGoods.length > 0 ? (
                    recentGoods.map(item => (
                    <LinkContainer to={`/goods/${item.goods_id}`} key={item.goods_id}>
                        <ListGroup.Item action>{item.title} - {item.price}원</ListGroup.Item>
                    </LinkContainer>
                    ))
                ) : (
                    <ListGroup.Item>등록된 굿즈가 없습니다.</ListGroup.Item>
                )}
                </ListGroup>
                <Card.Footer className="text-end">
                    <LinkContainer to="/goods">
                        <Button variant="secondary" size="sm">더보기</Button>
                    </LinkContainer>
                </Card.Footer>
            </Card>
        </Col>

        {userId && (
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header as="h5">즐겨찾기</Card.Header>
              <ListGroup variant="flush">
                {favorites.length > 0 ? (
                  favorites.map(fav => (
                    <LinkContainer to={fav.company_id ? `/companies/${fav.company_id}` : `/celebs/${fav.celeb_id}`} key={fav.favorite_id}>
                      <ListGroup.Item action>{fav.company_name || fav.celeb_nickname}</ListGroup.Item>
                    </LinkContainer>
                  ))
                ) : (
                  <ListGroup.Item>즐겨찾기한 항목이 없습니다.</ListGroup.Item>
                )}
              </ListGroup>
              <Card.Footer className="text-end">
                  <LinkContainer to="/favorites">
                      <Button variant="secondary" size="sm">더보기</Button>
                  </LinkContainer>
              </Card.Footer>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default HomePage;
