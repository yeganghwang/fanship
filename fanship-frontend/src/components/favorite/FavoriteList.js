import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
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
      setError(null);
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
    if (window.confirm('정말로 이 항목을 즐겨찾기에서 삭제하시겠습니까?')) {
        try {
            await removeFavorite(favoriteId, token);
            // Refresh list by filtering out the removed item
            setFavorites(favorites.filter(fav => fav.favorite_id !== favoriteId));
        } catch (err) {
            setError(err.message || '즐겨찾기 삭제에 실패했습니다.');
        }
    }
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
      <ListGroup>
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <ListGroup.Item key={fav.favorite_id} className="d-flex justify-content-between align-items-center">
              <LinkContainer to={fav.company_id ? `/companies/${fav.company_id}` : `/celebs/${fav.celeb_id}`}>
                <a href={fav.company_id ? `/companies/${fav.company_id}` : `/celebs/${fav.celeb_id}`} className="text-decoration-none text-dark fw-bold">
                  {fav.company_name || fav.celeb_nickname}
                  <small className="text-muted ms-2">({fav.company_id ? '회사' : '셀럽'})</small>
                </a>
              </LinkContainer>
              <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFavorite(fav.favorite_id)}>삭제</Button>
            </ListGroup.Item>
          ))
        ) : (
          <Alert variant="info">즐겨찾기한 항목이 없습니다.</Alert>
        )}
      </ListGroup>
      <div className="d-flex justify-content-center mt-3">
        {renderPagination()}
      </div>
    </>
  );
}

export default FavoriteList;