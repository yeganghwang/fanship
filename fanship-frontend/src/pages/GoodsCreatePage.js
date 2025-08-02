import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createGoods } from '../api/goods';
import GoodsForm from '../components/goods/GoodsForm';

function GoodsCreatePage({ token }) {
  const navigate = useNavigate();

  const handleSubmit = async (goodsData) => {
    try {
      const newGoods = await createGoods(goodsData, token);
      alert('굿즈가 성공적으로 등록되었습니다.');
      navigate(`/goods/${newGoods.goods_id}`);
    } catch (error) {
      alert(`굿즈 등록 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <div>
      <h1>새 굿즈 등록</h1>
      <GoodsForm onSubmit={handleSubmit} />
    </div>
  );
}

export default GoodsCreatePage;
