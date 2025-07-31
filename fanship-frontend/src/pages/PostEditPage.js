import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>게시글 수정</h1>
      <PostForm onSubmit={handleSubmit} initialData={post} />
    </div>
  );
}

export default PostEditPage;
