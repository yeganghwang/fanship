import React, { useState, useEffect } from 'react';
import { ListGroup, Pagination, Spinner, Alert, Nav, Form, Button, InputGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
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

  const regions = ['전체', '서울', '부산', '대구']; // You can expand this list

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
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

  const handleRegionChange = (newRegion) => {
    setPage(1);
    setRegion(newRegion === '전체' ? '' : newRegion);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchTerm);
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
      {/* Region Tabs */}
      <Nav variant="tabs" activeKey={region || '전체'} onSelect={handleRegionChange} className="mb-3">
        {regions.map((r) => (
          <Nav.Item key={r}>
            <Nav.Link eventKey={r}>{r}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Search Form */}
      <Form onSubmit={handleSearch} className="mb-3">
        <InputGroup>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="회사 이름으로 검색"
          />
          <Button variant="outline-secondary" type="submit">검색</Button>
        </InputGroup>
      </Form>

      {/* Company List */}
      <ListGroup>
        {companies.length > 0 ? (
          companies.map((company) => (
            <LinkContainer to={`/companies/${company.company_id}`} key={company.company_id}>
              <ListGroup.Item action>
                <div className="fw-bold">{company.company_name}</div>
                <small className="text-muted">{company.company_type} | {company.region}</small>
              </ListGroup.Item>
            </LinkContainer>
          ))
        ) : (
          <ListGroup.Item>결과가 없습니다.</ListGroup.Item>
        )}
      </ListGroup>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        {renderPagination()}
      </div>
    </>
  );
}

export default CompanyList;
