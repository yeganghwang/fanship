import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!goods) return <div>굿즈 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{goods.title}</h2>
      <p>판매자: {goods.seller_nickname}</p>
      <p>가격: {goods.price}원</p>
      <p>수량: {goods.amount}</p>
      <div dangerouslySetInnerHTML={{ __html: goods.content }} />

      {canEditOrDelete() && (
        <div>
          <button onClick={() => navigate(`/goods/${goodsId}/edit`)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
    </div>
  );
}

export default GoodsDetailPage;
