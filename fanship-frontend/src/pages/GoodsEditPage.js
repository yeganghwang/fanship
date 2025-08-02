import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGoods, updateGoods } from '../api/goods';
import GoodsForm from '../components/goods/GoodsForm';

function GoodsEditPage({ token }) {
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

  const handleSubmit = async (goodsData) => {
    try {
      await updateGoods(goodsId, goodsData, token);
      alert('굿즈 정보가 성공적으로 수정되었습니다.');
      navigate(`/goods/${goodsId}`);
    } catch (error) {
      alert(`굿즈 수정 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!goods) return <div>굿즈 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>굿즈 수정</h1>
      <GoodsForm onSubmit={handleSubmit} initialData={goods} />
    </div>
  );
}

export default GoodsEditPage;
