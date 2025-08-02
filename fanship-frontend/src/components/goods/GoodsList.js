import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGoodsList } from '../../api/goods';

function GoodsList() {
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sellerId, setSellerId] = useState('');

  useEffect(() => {
    const fetchGoods = async () => {
      setLoading(true);
      try {
        const params = { page, limit };
        if (sellerId) {
          params.seller_id = sellerId;
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
  }, [page, limit, sellerId]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h2>굿즈 목록</h2>
      <div>
        <label>판매자 ID로 필터링:</label>
        <input
          type="text"
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
          placeholder="판매자 ID 입력"
        />
      </div>
      <ul>
        {goods.map((item) => (
          <li key={item.goods_id}>
            <Link to={`/goods/${item.goods_id}`}>{item.title}</Link> - {item.price}원 (수량: {item.amount})
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>이전</button>
        <span>페이지 {page} / {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>다음</button>
      </div>
    </div>
  );
}

export default GoodsList;
