import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCelebsByCompanyId } from '../api/company';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorite';
import { getPostsByUserId } from '../api/post';

function CompanyDetailPage({ userId, token }) {
  const { companyId } = useParams();
  const [companyName, setCompanyName] = useState('');
  const [company, setCompany] = useState(null);
  const [celebs, setCelebs] = useState([]);
  const [ceoPosts, setCeoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const checkFavoriteStatus = async () => {
    if (!userId || !token) return;
    try {
      const response = await getFavorites(userId, token, { limit: 100 });
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
      try {
        const celebsResponse = await getCelebsByCompanyId(companyId, { page, limit });
        setCelebs(celebsResponse.list);
        setTotalPages(celebsResponse.pagination.total_pages);
        setCompanyName(celebsResponse.company_name);

        // CEO 게시글 가져오기
        if (celebsResponse.ceo_id) {
          const ceoPostsResponse = await getPostsByUserId(celebsResponse.ceo_id);
          setCeoPosts(ceoPostsResponse.list);
        }

        checkFavoriteStatus();

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

  const handleAddFavorite = async () => {
    try {
      await addFavorite({ company_id: parseInt(companyId, 10) }, token);
      alert('즐겨찾기에 추가되었습니다.');
      checkFavoriteStatus();
    } catch (err) {
      alert(`즐겨찾기 추가 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  const handleRemoveFavorite = async () => {
    if (!favoriteId) return;
    try {
      await removeFavorite(favoriteId, token);
      alert('즐겨찾기에서 삭제되었습니다.');
      checkFavoriteStatus();
    } catch (err) {
      alert(`즐겨찾기 삭제 실패: ${err.message || '알 수 없는 오류'}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!companyName) return <div>회사 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{companyName} 상세 정보</h2>
      {token && (
        isFavorite ? (
          <button onClick={handleRemoveFavorite}>즐겨찾기 삭제</button>
        ) : (
          <button onClick={handleAddFavorite}>즐겨찾기 추가</button>
        )
      )}

      <h3>소속 셀럽</h3>
      <ul>
        {celebs.map((celeb) => (
          <li key={celeb.celeb_id}>
            <Link to={`/celebs/${celeb.celeb_id}`}>
              {celeb.nickname}
            </Link> ({celeb.celeb_type})
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>이전</button>
        <span>페이지 {page} / {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>다음</button>
      </div>

      <h3>CEO 작성글</h3>
      <ul>
        {ceoPosts.map(post => (
          <li key={post.post_id}>
            <Link to={`/posts/${post.post_id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyDetailPage;