import React, { useState, useEffect } from 'react';
import { ListGroup, Pagination, Spinner, Alert, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getPosts } from '../../api/post';
import { formatToKST } from '../../utils/date';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('전체');

  const tabs = ['전체', '공지'];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit };
        if (activeTab === '공지') {
          params.notice = true;
        }
        const response = await getPosts(params);
        setPosts(response.list);
        setTotalPages(response.pagination.total_pages);
      } catch (err) {
        setError(err.message || '게시글 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit, activeTab]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleTabChange = (tab) => {
    setPage(1);
    setActiveTab(tab);
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
      <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabChange} className="mb-3">
        {tabs.map((tab) => (
          <Nav.Item key={tab}>
            <Nav.Link eventKey={tab}>{tab}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <ListGroup>
        {posts.length > 0 ? (
          posts.map((post) => (
            <LinkContainer to={`/posts/${post.post_id}`} key={post.post_id}>
              <ListGroup.Item action>
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{post.title}</h5>
                  <small>{formatToKST(post.created_at)}</small>
                </div>
                <p className="mb-1">작성자: {post.nickname}</p>
              </ListGroup.Item>
            </LinkContainer>
          ))
        ) : (
          <ListGroup.Item>게시글이 없습니다.</ListGroup.Item>
        )}
      </ListGroup>

      <div className="d-flex justify-content-center mt-3">
        {renderPagination()}
      </div>
    </>
  );
}

export default PostList;