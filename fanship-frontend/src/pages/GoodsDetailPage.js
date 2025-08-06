import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { getGoods, deleteGoods } from '../api/goods';

function GoodsDetailPage({ userId, token, position }) {
  const { goodsId } = useParams();
  const navigate = useNavigate();
  const [goods, setGoods] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoods = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getGoods(goodsId);
        setGoods(response);
      } catch (err) {
        setError(err.message || '굿즈 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (goodsId) {
      fetchGoods();
    }
  }, [goodsId]);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 굿즈를 삭제하시겠습니까?')) {
      try {
        await deleteGoods(goodsId, token);
        alert('굿즈가 삭제되었습니다.');
        navigate('/goods');
      } catch (err) {
        alert(`굿즈 삭제 실패: ${err.message || '알 수 없는 오류'}`);
      }
    }
  };

  const canEditOrDelete = () => {
    if (!goods || !userId) return false;
    if (position === 'manager' || position === 'developer') return true;
    return goods.seller_id === parseInt(userId, 10);
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!goods) return <Alert variant="warning">굿즈 정보를 찾을 수 없습니다.</Alert>;

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">{goods.title}</Card.Title>
        <Card.Subtitle className="text-muted">판매자: {goods.seller_nickname}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Text as="div">
          <p><strong>가격:</strong> {goods.price.toLocaleString()}원</p>
          <p><strong>남은 수량:</strong> {goods.amount}</p>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: goods.content }} />
        </Card.Text>
      </Card.Body>
      {canEditOrDelete() && (
        <Card.Footer className="text-end">
          <ButtonGroup>
            <Button variant="outline-secondary" onClick={() => navigate(`/goods/${goodsId}/edit`)}>수정</Button>
            <Button variant="outline-danger" onClick={handleDelete}>삭제</Button>
          </ButtonGroup>
        </Card.Footer>
      )}
    </Card>
  );
}

export default GoodsDetailPage;
