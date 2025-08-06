import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
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
      setError(null);
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
        // Refresh the list after deletion
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
    <div>
      <h4 className="mt-4">댓글 ({comments.length})</h4>
      <ListGroup>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <ListGroup.Item key={comment.comment_id} className="d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{comment.nickname}</div>
                {comment.content}
                <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                  {formatToKST(comment.created_at)}
                </div>
              </div>
              {canEditOrDelete(comment) && (
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(comment.comment_id)}>삭제</Button>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>작성된 댓글이 없습니다.</ListGroup.Item>
        )}
      </ListGroup>
      <div className="d-flex justify-content-center mt-3">
        {renderPagination()}
      </div>
    </div>
  );
}

export default CommentList;
