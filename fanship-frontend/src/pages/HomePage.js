import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, ListGroup, Row, Col, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getPosts } from '../api/post';
import { getCompanyList } from '../api/company';
import { getGoodsList } from '../api/goods';

function HomePage({ userId, position, celebId }) {
  const [recentPosts, setRecentPosts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [recentGoods, setRecentGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      try {
        // 여러 API를 동시에 호출하여 병렬로 데이터를 가져옵니다.
        const [postsResponse, companiesResponse, goodsResponse] = await Promise.all([
          getPosts({ limit: 5 }),
          getCompanyList({ limit: 5 }),
          getGoodsList({ limit: 5 })
        ]);
        
        setRecentPosts(postsResponse.list);
        setCompanies(companiesResponse.list);
        setRecentGoods(goodsResponse.list);

      } catch (err) {
        setError(err.message || '홈페이지 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      {/* 셀럽 전용 카드 */}
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
        {/* 최신 게시글 */}
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

        {/* 주요 회사 */}
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

      {/* 인기 굿즈 */}
      <Row>
        <Col>
            <Card>
                <Card.Header as="h5">인기 굿즈</Card.Header>
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
      </Row>
    </Container>
  );
}

export default HomePage;
