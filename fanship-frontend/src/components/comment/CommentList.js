import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import { getComments, deleteComment } from '../../api/comment';
import { formatToKST } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';

function CommentList({ postId, userId, token, position }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // postId가 바뀔 때 page를 1로 초기화 (새 게시글 이동 시 중복 호출 방지)
  useEffect(() => {
    setPage(1);
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
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
    fetchComments();
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

  const handleProfileClick = (comment) => {
    if (comment.celeb_id) {
      navigate(`/celebs/${comment.celeb_id}`);
    } else if (comment.company_id) {
      navigate(`/companies/${comment.company_id}`);
    } else if (comment.writer_id) {
      navigate(`/users/${comment.writer_id}`)
    }
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h4 className="mt-4">댓글 ({comments.length})</h4>
      <ListGroup>
        {comments.length > 0 ? (
          comments.map((comment) => {
            const clickable = (comment.celeb_id || comment.company_id || comment.writer_id);
            return (
              <ListGroup.Item key={comment.comment_id} className="d-flex">
                <Avatar
                  url={comment.pfp_img_url}
                  nickname={comment.nickname}
                  size={44}
                  clickable={clickable}
                  onClick={() => handleProfileClick(comment)}
                />
                <div className="ms-3 flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="d-flex flex-wrap align-items-center" style={{ gap: 8 }}>
                    <span
                      className="fw-bold"
                      style={{ lineHeight: 1.2, cursor: clickable ? 'pointer' : 'default' }}
                      onClick={clickable ? () => handleProfileClick(comment) : undefined}
                      role={clickable ? 'button' : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleProfileClick(comment); } } : undefined}
                    >
                      {comment.nickname}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>{formatToKST(comment.created_at)}</span>
                  </div>
                  <div className="mt-1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{comment.content}</div>
                </div>
                {canEditOrDelete(comment) && (
                  <div className="ms-2 d-flex align-items-center">
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(comment.comment_id)}>삭제</Button>
                  </div>
                )}
              </ListGroup.Item>
            );
          })
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
