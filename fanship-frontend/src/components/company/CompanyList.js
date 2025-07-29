import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanyList } from '../../api/company';

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Filtering and Search state
  const [region, setRegion] = useState(''); // For tab selection
  const [searchTerm, setSearchTerm] = useState(''); // For the input field
  const [searchQuery, setSearchQuery] = useState(''); // For the actual API query

  const regions = ['전체', '서울', '부산', '대구'];

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const params = { page, limit };
        if (region && region !== '전체') {
          params.region = region;
        }
        if (searchQuery) {
          params.company_name = searchQuery;
        }

        const response = await getCompanyList(params);
        setCompanies(response.list);
        setTotalPages(response.pagination.total_pages || 1);
      } catch (err) {
        setError(err.message || '회사 목록을 불러오는데 실패했습니다.');
        setCompanies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [page, limit, region, searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleRegionChange = (newRegion) => {
    setPage(1);
    setRegion(newRegion === '전체' ? '' : newRegion);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchTerm);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h2>회사 목록</h2>

      {/* Region Tabs */}
      <div>
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => handleRegionChange(r)}
            style={{ fontWeight: (region === r || (r === '전체' && !region)) ? 'bold' : 'normal' }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="회사 이름으로 검색"
        />
        <button type="submit">검색</button>
      </form>

      {/* Company List */}
      <ul>
        {companies.length > 0 ? (
          companies.map((company) => (
            <li key={company.company_id}>
              <Link to={`/companies/${company.company_id}`}>
                {company.company_name}
              </Link> ({company.company_type}, {company.region})
            </li>
          ))
        ) : (
          <p>결과가 없습니다.</p>
        )}
      </ul>

      {/* Pagination */}
      <div>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>이전</button>
        <span>페이지 {page} / {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>다음</button>
      </div>
    </div>
  );
}

export default CompanyList;
