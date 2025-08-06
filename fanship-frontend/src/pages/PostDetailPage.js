import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { getPost, deletePost } from '../api/post';
import { formatToKST } from '../utils/date';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';

function PostDetailPage({ userId, token, position, companyId }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      const postResponse = await getPost(postId);
      setPost(postResponse);
    } catch (err) {
      setError(err.message || '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(postId, token);
        alert('게시글이 삭제되었습니다.');
        navigate('/posts');
      } catch (err) {
        alert(`게시글 삭제 실패: ${err.message || '알 수 없는 오류'}`);
      }
    }
  };

  const canEditOrDelete = () => {
    if (!post || !userId) return false;
    if (position === 'manager' || position === 'developer') return true;
    if (post.writer_id === parseInt(userId, 10)) return true;
    if (position === 'ceo' && post.writer_company_id === parseInt(companyId, 10)) return true;
    return false;
  };

  const handleCommentCreated = () => {
    // CommentList will now refetch on its own, but we can trigger a refresh if needed
    // For now, this can be simplified as CommentList is self-sufficient
    fetchPostDetails(); // Or simply let CommentList handle its state
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!post) return <Alert variant="warning">게시글을 찾을 수 없습니다.</Alert>;

  return (
    <>
      <Card className="mb-4">
        <Card.Header>
          <Card.Title as="h2">{post.title}</Card.Title>
          <Card.Subtitle className="d-flex justify-content-between text-muted mt-2">
            <span>작성자: {post.nickname}</span>
            <span>조회수: {post.views}</span>
            <span>작성일: {formatToKST(post.created_at)}</span>
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <div style={{ whiteSpace: 'pre-wrap', minHeight: '200px' }}>{post.content}</div>
        </Card.Body>
        {canEditOrDelete() && (
          <Card.Footer className="text-end">
            <ButtonGroup>
              <Button variant="outline-secondary" onClick={() => navigate(`/posts/${postId}/edit`)}>수정</Button>
              <Button variant="outline-danger" onClick={handleDelete}>삭제</Button>
            </ButtonGroup>
          </Card.Footer>
        )}
      </Card>

      <CommentForm postId={postId} token={token} onCommentCreated={handleCommentCreated} />
      <hr className="my-4" />
      <CommentList postId={postId} userId={userId} token={token} position={position} />
    </>
  );
}

export default PostDetailPage;
