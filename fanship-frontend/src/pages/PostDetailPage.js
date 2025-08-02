import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [comments, setComments] = useState([]);

  const fetchPostAndComments = async () => {
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
      fetchPostAndComments();
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

  const handleCommentCreated = (newComment) => {
    setComments([newComment, ...comments]);
    fetchPostAndComments(); // Refresh comments
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>작성자: {post.nickname}</p>
      <p>작성일: {formatToKST(post.created_at)}</p>
      <p>조회수: {post.views}</p>
      <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>

      {canEditOrDelete() && (
        <div>
          <button onClick={() => navigate(`/posts/${postId}/edit`)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}

      <hr />

      <CommentForm postId={postId} token={token} onCommentCreated={handleCommentCreated} />
      <CommentList postId={postId} userId={userId} token={token} position={position} />
    </div>
  );
}

export default PostDetailPage;
