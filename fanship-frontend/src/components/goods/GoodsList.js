import React, { useState, useEffect } from 'react';
import { ListGroup, Pagination, Spinner, Alert, Form, InputGroup, Button, Card, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getGoodsList } from '../../api/goods';

function GoodsList() {
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12); // Card layout might look better with fewer items per row
  const [totalPages, setTotalPages] = useState(1);
  const [sellerId, setSellerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGoods = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit };
        if (searchTerm) {
          params.seller_id = searchTerm;
        }
        const response = await getGoodsList(params);
        setGoods(response.list);
        setTotalPages(response.pagination.total_pages);
      } catch (err) {
        setError(err.message || '굿즈 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoods();
  }, [page, limit, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(sellerId);
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

  return (
    <>
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            placeholder="판매자 ID로 필터링"
          />
          <Button variant="outline-secondary" type="submit">검색</Button>
        </InputGroup>
      </Form>

      <Row xs={1} md={2} lg={3} className="g-4">
        {goods.length > 0 ? (
          goods.map((item) => (
            <Col key={item.goods_id}>
              <Card className="h-100">
                {/* You might want an image for the goods */}
                {/* <Card.Img variant="top" src={item.image_url || 'https://via.placeholder.com/150'} /> */}
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text as="div">
                    <strong>가격:</strong> {item.price.toLocaleString()}원
                    <br />
                    <strong>남은 수량:</strong> {item.amount}
                  </Card.Text>
                  <LinkContainer to={`/goods/${item.goods_id}`}>
                    <Button variant="primary">상세보기</Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">등록된 굿즈가 없습니다.</Alert>
          </Col>
        )}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        {renderPagination()}
      </div>
    </>
  );
}

export default GoodsList;
