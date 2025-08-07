import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { getPost, updatePost } from '../api/post';
import PostForm from '../components/post/PostForm';

function PostEditPage({ token }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPost(postId);
        setPost(response);
      } catch (err) {
        setError(err.message || '게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleSubmit = async (postData) => {
    try {
      await updatePost(postId, postData, token);
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/posts/${postId}`);
    } catch (error) {
      alert(`게시글 수정 실패: ${error.message || '알 수 없는 오류'}`);
    }
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!post) return <Alert variant="warning">게시글을 찾을 수 없습니다.</Alert>;

  return (
    <>
      <h1 className="mb-4">게시글 수정</h1>
      <Card>
        <Card.Body>
          <PostForm onSubmit={handleSubmit} initialData={post} isEdit={true} />
        </Card.Body>
      </Card>
    </>
  );
}

export default PostEditPage;
