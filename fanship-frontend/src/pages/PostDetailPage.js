import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { getPost, deletePost } from '../api/post';
import { formatToKST } from '../utils/date';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import './PostDetailPage.css';
import Avatar from '../components/common/Avatar';

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
    fetchPostDetails();
  };

  const handleWriterNavigate = () => {
    if (!post) return;
    if (post.celeb_id) navigate(`/celebs/${post.celeb_id}`);
    else if (post.company_id) navigate(`/companies/${post.company_id}`);
    else if (post.writer_id) navigate(`/users/${post.writer_id}`);
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!post) return <Alert variant="warning">게시글을 찾을 수 없습니다.</Alert>;

  // Sanitize the HTML content before rendering
  const contentWithBreaks = post.content.replace(/\n/g, '<br />');
  const cleanHtml = DOMPurify.sanitize(contentWithBreaks);

  // 작성자 메타 정보: 줄바꿈 방지 및 작은 화면 처리
  // 요구사항: "작성자: 닉네임", "조회수: 13", "작성일: ..." 이 중간에 줄바꿈 되지 않게.
  // 각 항목은 white-space: nowrap 으로 보호, 전체는 overflow-x: auto 로 작은 화면 대응.
  const metaItems = [
    { label: '작성자', value: post.nickname },
    { label: '조회수', value: post.views },
    { label: '작성일', value: formatToKST(post.created_at) },
  ];

  // 프로필 이미지 필드 후보 (백엔드 명명 불확실시 다중 시도)
  const writerPfp = post.pfp_img_url || post.writer_pfp_img_url || post.user_pfp_img_url || null;
  const writerClickable = !!(post.celeb_id || post.company_id || post.writer_id);

  return (
    <>
      <Card className="mb-4">
        <Card.Header>
          <Card.Title as="h2" className="mb-3" style={{ wordBreak: 'break-word' }}>{post.title}</Card.Title>
          <div className="d-flex" style={{ gap: 16 }}>
            <Avatar
              url={writerPfp}
              nickname={post.nickname}
              size={52}
              clickable={writerClickable}
              onClick={writerClickable ? handleWriterNavigate : undefined}
            />
            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
              <div className="post-meta">
                {metaItems.map(m => (
                  <span
                    key={m.label}
                    className="post-meta-item"
                    style={m.label === '작성자' && writerClickable ? { cursor: 'pointer' } : undefined}
                    onClick={m.label === '작성자' && writerClickable ? handleWriterNavigate : undefined}
                    role={m.label === '작성자' && writerClickable ? 'button' : undefined}
                    tabIndex={m.label === '작성자' && writerClickable ? 0 : undefined}
                    onKeyDown={m.label === '작성자' && writerClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWriterNavigate(); } } : undefined}
                  >
                    <strong>{m.label}:</strong>&nbsp;{m.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="post-content-view" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
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