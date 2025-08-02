import React, { useState, useEffect } from 'react';
import { getComments, deleteComment } from '../../api/comment';
import { formatToKST } from '../../utils/date';

function CommentList({ postId, userId, token, position }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await getComments(postId, { page, limit });
        setComments(response.list);
        setTotalPages(response.pagination.total_pages);
      } catch (err) {
        setError(err.message || '댓글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, page, limit]);

  const handleDelete = async (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment(commentId, token);
        setComments(comments.filter(comment => comment.comment_id !== commentId));
      } catch (err) {
        alert(`댓글 삭제 실패: ${err.message || '알 수 없는 오류'}`);
      }
    }
  };

  const canEditOrDelete = (comment) => {
    if (!userId) return false;
    if (position === 'manager' || position === 'developer') return true;
    return comment.writer_id === parseInt(userId, 10);
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
      <h3>댓글</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.comment_id}>
            <p>{comment.content}</p>
            <p>작성자: {comment.nickname} ({formatToKST(comment.created_at)})</p>
            {canEditOrDelete(comment) && (
              <button onClick={() => handleDelete(comment.comment_id)}>삭제</button>
            )}
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

export default CommentList;
