import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h2>게시글 목록</h2>
      <div>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{ fontWeight: activeTab === tab ? 'bold' : 'normal' }}
          >
            {tab}
          </button>
        ))}
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.post_id}>
            <Link to={`/posts/${post.post_id}`}>{post.title}</Link> - <Link to={`/users/${post.writer_id}`}>{post.nickname}</Link> ({formatToKST(post.created_at)})
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

export default PostList;