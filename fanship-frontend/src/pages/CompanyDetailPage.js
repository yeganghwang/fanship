import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCelebsByCompanyId } from '../api/company';
import { addFavorite } from '../api/favorite';

function CompanyDetailPage({ token }) {
  const { companyId } = useParams();
  const [celebs, setCelebs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCelebs = async () => {
      setLoading(true);
      try {
        const response = await getCelebsByCompanyId(companyId, { page, limit });
        setCelebs(response.list);
        setTotalPages(response.pagination.total_pages);
      } catch (err) {
        setError(err.message || '셀럽 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCelebs();
    }
  }, [companyId, page, limit]);

  const handleAddFavorite = async () => {
    try {
      await addFavorite({ company_id: parseInt(companyId, 10) }, token);
      alert('즐겨찾기에 추가되었습니다.');
    } catch (err) {
      alert(`즐겨찾기 추가 실패: ${err.message || '알 수 없는 오류'}`);
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
      <h2>회사 ID: {companyId} 소속 셀럽 목록</h2>
      <button onClick={handleAddFavorite}>즐겨찾기 추가</button>
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
    </div>
  );
}

export default CompanyDetailPage;
