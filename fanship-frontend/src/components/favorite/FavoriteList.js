import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../../api/favorite';

function FavoriteList({ userId, token }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await getFavorites(userId, token, { page, limit });
        setFavorites(response.list);
        setTotalPages(response.pagination.total_pages);
      } catch (err) {
        setError(err.message || '즐겨찾기 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchFavorites();
    }
  }, [userId, token, page, limit]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId, token);
      // Optimistically update the UI by removing the favorite from the list
      setFavorites(favorites.filter(fav => fav.favorite_id !== favoriteId));
    } catch (err) {
      setError(err.message || '즐겨찾기 삭제에 실패했습니다.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h2>즐겨찾기 목록</h2>
      <ul>
        {favorites.map((fav) => (
          <li key={fav.favorite_id}>
            {fav.company_id ? (
              <Link to={`/companies/${fav.company_id}`}>{fav.company_name}</Link>
            ) : (
              <Link to={`/celebs/${fav.celeb_id}`}>{fav.celeb_nickname}</Link>
            )}
            <button onClick={() => handleRemoveFavorite(fav.favorite_id)}>삭제</button>
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

export default FavoriteList;